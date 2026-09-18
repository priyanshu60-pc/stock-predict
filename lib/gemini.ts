import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

/**
 * Generate a personalized welcome email body for a new user.
 */
export async function generateWelcomeEmail(name: string): Promise<string> {
  const prompt = `
You are writing a warm, personalized welcome email for a user named "${name}" 
who just signed up for Signalist, a real-time stock market tracking platform.

Write a concise, friendly, and professional welcome message (3-4 sentences).
Mention that they can track live stock prices, set price alerts, and get AI-powered 
market insights. Make it feel personal and exciting.

Return only clean HTML content (no markdown, no wrapper tags like <html><body>).
Use inline styles for formatting. Keep it simple.
`

  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

/**
 * Generate a daily market digest email body.
 */
export async function generateDailyDigest(
  symbols: string[],
  priceData: Record<string, { price: number; change: number }>
): Promise<string> {
  const stockSummary = symbols
    .map((s) => {
      const d = priceData[s]
      if (!d) return `${s}: data unavailable`
      const direction = d.change >= 0 ? '▲' : '▼'
      return `${s}: $${d.price.toFixed(2)} ${direction} ${Math.abs(d.change).toFixed(2)}%`
    })
    .join('\n')

  const prompt = `
You are a financial market analyst writing a brief daily digest email for a retail investor.

Here are their tracked stocks today:
${stockSummary}

Write 2-3 sentences summarizing the market sentiment for these stocks.
Be concise, informative, and mention notable moves. 
Return only clean HTML content, no markdown.
`

  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

/**
 * Generate a brief AI insight paragraph for a single stock.
 */
export async function generateStockInsight(symbol: string): Promise<string> {
  const prompt = `
Give a brief, balanced 2-sentence market insight about the stock ticker "${symbol}".
Focus on recent performance trends and what retail investors should watch.
Return plain text only, no HTML, no markdown.
`
  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

/**
 * Generate a 0-10 confidence score for a stock in the Indian market.
 */
export async function analyzeStockConfidence(symbol: string): Promise<{ confidenceScore: number, reasoning: string }> {
  const prompt = `
You are an expert Indian stock market analyst. 
Please analyze the stock ticker "${symbol}".
Evaluate its fundamentals, recent market trends, and technical outlook in the context of the Indian stock market.

Return a JSON object with EXACTLY two fields:
1. "confidenceScore": A number from 0 to 10 indicating how strong of a "buy" this is right now (10 is extremely strong buy, 0 is strong sell).
2. "reasoning": A short, 2-3 sentence explanation for this score.

DO NOT return any markdown formatting like \`\`\`json. Return ONLY the raw JSON object.
`
  const result = await geminiModel.generateContent(prompt)
  const text = result.response.text().trim()
  
  // Clean up potential markdown formatting from Gemini
  const cleanJson = text.replace(/^```json/i, '').replace(/```$/, '').trim()
  
  try {
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", cleanJson)
    return { confidenceScore: 5, reasoning: "Unable to analyze at this time due to parsing error." }
  }
}

/**
 * Generate an intraday analysis signal for a given stock symbol.
 * Expects a structured JSON output with a 0-100 score.
 */
export async function analyzeIntradaySetup(symbol: string): Promise<{ signal: 'Bullish' | 'Bearish' | 'Neutral', confidenceScore: number, reasoning: string }> {
  const prompt = `
You are an expert intraday Indian stock market day trader. 
Analyze the stock ticker "${symbol}" for a same-day intraday setup.
Consider typical behavior of this stock, its volatility, and hypothetical 5-minute candle patterns involving SMA 20/50/200, RSI 14, and MACD.

Return a JSON object with EXACTLY three fields:
1. "signal": Must be exactly one of "Bullish", "Bearish", or "Neutral".
2. "confidenceScore": A number from 0 to 100 indicating conviction (100 = perfect setup).
3. "reasoning": A detailed explanation covering:
   - Price vs SMAs (20, 50, 200)
   - RSI levels
   - Volume confirmation
   - Support/Resistance context

DO NOT return any markdown formatting like \`\`\`json. Return ONLY the raw JSON object.
`
  const result = await geminiModel.generateContent(prompt)
  const text = result.response.text().trim()
  
  const cleanJson = text.replace(/^```json/i, '').replace(/```$/, '').trim()
  
  try {
    return JSON.parse(cleanJson)
  } catch (e) {
    console.error("Failed to parse Gemini Intraday JSON:", cleanJson)
    return { signal: 'Neutral', confidenceScore: 50, reasoning: "Unable to analyze intraday data due to parsing error." }
  }
}

