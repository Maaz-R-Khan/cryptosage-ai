import { GoogleGenAI, Type } from "@google/genai";
import { CryptoData, AnalysisResult } from "../types";

// Initialize the Gemini client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const context = `
    Current Market Data:
    Bitcoin (BTC): $${marketData.bitcoin.usd}
    Ethereum (ETH): $${marketData.ethereum.usd}
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
        systemInstruction: "You are a helpful, cautious, and data-driven financial assistant. Always prioritize risk management in your advice.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate analysis. Please try again.");
  }
};
