# AI Studio Prompt Design Summary

## Overview

The AI feature was designed using Google AI Studio to create a structured prompt that analyzes cryptocurrency market queries and returns actionable insights.

## Prompt Design Process

### 1. Initial Design in AI Studio

**Goal**: Create a financial analyst that provides structured crypto market analysis.

**Approach**: Used **Structured Prompts** with JSON output schema in Google AI Studio.

### 2. Final Prompt Structure

Located in: `services/geminiService.ts`

```typescript
const fullPrompt = `
  You are a senior cryptocurrency financial analyst. 
  Analyze the user's query provided below in the context of the current market data.
  
  User Query: "${userPrompt}"
  ${context}

  Provide a structured analysis.
  If the user query is not related to crypto/finance, politely pivot the analysis 
  to general market sentiment or ask them to clarify, but still return valid JSON.
`;
```

### 3. JSON Schema (Structured Output)

```typescript
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
```

### 4. System Instructions

```typescript
systemInstruction: "You are a helpful, cautious, and data-driven financial assistant. 
Always prioritize risk management in your advice."
```

## Example Input/Output

### Example Input 1
**User Query**: "Should I buy Bitcoin now? The price seems high."

**Market Context**:
- Bitcoin: $64,230
- Ethereum: $3,450

### Example Output 1
```json
{
  "summary": "Bitcoin is currently trading at $64,230, which represents a significant price point. While the price may seem high relative to historical lows, current market indicators suggest continued institutional interest. However, given the volatility inherent in cryptocurrency markets, a cautious approach is recommended.",
  "sentimentScore": 65,
  "keyInsights": [
    "Current price reflects strong institutional adoption and market confidence",
    "High volatility requires careful risk management and position sizing",
    "Consider dollar-cost averaging rather than lump-sum investments to mitigate timing risk"
  ],
  "recommendation": "HOLD"
}
```

### Example Input 2
**User Query**: "What's the outlook for Ethereum with the upcoming upgrades?"

**Market Context**:
- Bitcoin: $64,500
- Ethereum: $3,480

### Example Output 2
```json
{
  "summary": "Ethereum's upcoming upgrades, including improvements to scalability and transaction costs, are generally viewed positively by the market. At $3,480, Ethereum shows resilience. The upgrade roadmap suggests potential for increased adoption and network efficiency.",
  "sentimentScore": 72,
  "keyInsights": [
    "Network upgrades typically correlate with positive price momentum",
    "Current price level suggests market anticipation of improvements",
    "Long-term fundamentals remain strong despite short-term volatility"
  ],
  "recommendation": "BUY"
}
```

## Prompt Features

### 1. Context-Aware
- Incorporates real-time market data (Bitcoin & Ethereum prices)
- Adapts analysis based on current market conditions

### 2. Structured Output
- Guaranteed JSON format
- Consistent schema for easy parsing and display

### 3. Error Handling
- Handles non-crypto queries gracefully
- Always returns valid JSON structure

### 4. Risk Management Focus
- System instruction emphasizes caution
- Recommendations include risk considerations

## Integration with External Data

The prompt combines:
1. **User Query** - Natural language question
2. **Market Data** - Real-time prices from CoinGecko API
3. **AI Analysis** - Gemini's financial analysis capabilities

This creates a comprehensive analysis that considers both user intent and current market conditions.

## Model Configuration

- **Model**: `gemini-2.5-flash`
- **Response Type**: `application/json`
- **Schema Enforcement**: Yes (via responseSchema)
- **Temperature**: Default (balanced for financial analysis)

## Testing in AI Studio

Before implementation, the prompt was tested in Google AI Studio with:
- Various crypto-related queries
- Non-crypto queries (to test error handling)
- Different market price scenarios
- Edge cases (empty queries, very long queries)

The structured output ensured consistent formatting for easy integration into the React frontend.

