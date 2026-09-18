const BASE = 'https://finnhub.io/api/v1'
const KEY = process.env.FINNHUB_API_KEY!

export async function searchStocks(query: string) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}&token=${KEY}`)
  return res.json()
}

export async function getQuote(symbol: string): Promise<{ c: number; dp: number; h: number; l: number; o: number }> {
  const res = await fetch(`${BASE}/quote?symbol=${symbol}&token=${KEY}`)
  return res.json()
}

export async function getCompanyProfile(symbol: string) {
  const res = await fetch(`${BASE}/stock/profile2?symbol=${symbol}&token=${KEY}`)
  return res.json()
}

export async function getNewsForSymbol(symbol: string) {
  const to = new Date().toISOString().split('T')[0]
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const res = await fetch(
    `${BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${KEY}`
  )
  return res.json()
}
