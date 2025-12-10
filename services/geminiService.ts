import { GoogleGenAI, Type } from "@google/genai";
import { CryptoData, AnalysisResult } from "../types";

// Lazy initialization function to get API client
const getAIClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Set it in your .env file.");
    console.error("process.env.API_KEY:", process.env.API_KEY);
    console.error("process.env.GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    throw new Error("GEMINI_API_KEY is not configured. Please check your .env file.");
  }

  console.log("✅ Gemini API Key found:", apiKey.substring(0, 10) + "...");
  return new GoogleGenAI({ apiKey });
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the analysis based on the user's question and current market data.",
    },
    sentimentScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating market sentiment (0 = Bearish, 100 = Bullish).",
    },
    keyInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Three key bullet points explaining the reasoning.",
    },
    recommendation: {
      type: Type.STRING,
      enum: ["BUY", "SELL", "HOLD"],
      description: "A general trading recommendation based on the sentiment.",
    },
  },
  required: ["summary", "sentimentScore", "keyInsights", "recommendation"],
};

export const generateCryptoAnalysis = async (
  userPrompt: string,
  marketData: CryptoData
): Promise<AnalysisResult> => {
  const keys = Object.keys(marketData || {});
  if (keys.length === 0) {
    throw new Error("No crypto market data available to analyze.");
  }

  const context = `
    Current Market Data:
    ${keys
      .map(
        (k) =>
          `${k.toUpperCase()}: $${marketData[k]?.usd?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}`
      )
      .join("\n")}
  `;

  const fullPrompt = `
    You are a senior cryptocurrency financial analyst. 
    Analyze the user's query provided below in the context of the current market data.
    
    User Query: "${userPrompt}"
    ${context}

    Provide a structured analysis.
    If the user query is not related to crypto/finance, politely pivot the analysis to general market sentiment or ask them to clarify, but still return valid JSON.
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction:
          "You are a helpful, cautious, and data-driven financial assistant. Always prioritize risk management in your advice.",
      },
    });

    // Extract text safely for different SDK response shapes
    let rawText = "";

    // Try different ways to extract the response text
    if (typeof response.text === "function") {
      rawText = response.text();
    } else if (response.text) {
      rawText = response.text;
    } else if (response.response?.text) {
      rawText = typeof response.response.text === "function"
        ? response.response.text()
        : response.response.text;
    } else if (response.response?.candidates?.[0]?.content?.parts) {
      rawText = response.response.candidates[0].content.parts
        .map((p: any) => p.text || "")
        .join("");
    }

    if (!rawText) {
      console.error("Full response:", JSON.stringify(response, null, 2));
      throw new Error("No response text from Gemini");
    }

    const parsed = JSON.parse(rawText) as AnalysisResult;

    // Validate the response has required fields
    if (!parsed.summary || parsed.sentimentScore === undefined || !parsed.keyInsights || !parsed.recommendation) {
      throw new Error("Invalid response format from Gemini");
    }

    return parsed;
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Handle quota exceeded errors
    if (error.status === "RESOURCE_EXHAUSTED" || error.message?.includes("quota")) {
      throw new Error(
        "⚠️ Gemini API quota exceeded. Please wait a few minutes or get a new API key from https://aistudio.google.com/app/apikey"
      );
    }

    // Handle invalid API key
    if (error.message?.includes("API key") || error.status === "PERMISSION_DENIED") {
      throw new Error("Invalid Gemini API key. Please check your .env file.");
    }

    throw new Error(
      error.message || "Failed to generate analysis. Please try again."
    );
  }
};
