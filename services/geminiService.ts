import { GoogleGenAI, Type } from "@google/genai";
import { CryptoData, AnalysisResult } from "../types";

// Initialize the Gemini client with strong guards
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.error("GEMINI_API_KEY is missing. Set it in your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction:
          "You are a helpful, cautious, and data-driven financial assistant. Always prioritize risk management in your advice.",
      },
    });

    // Extract text safely for different SDK response shapes
    const rawText =
      (typeof response.text === "function" ? response.text() : response.text) ||
      response.response?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") ||
      "";

    if (!rawText) throw new Error("No response from Gemini");

    return JSON.parse(rawText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      "Failed to generate analysis. Please check your Gemini API key and try again."
    );
  }
};
