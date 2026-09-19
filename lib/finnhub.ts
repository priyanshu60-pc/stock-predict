const BASE = 'https://finnhub.io/api/v1'
const KEY = process.env.FINNHUB_API_KEY!

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Finnhub request failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}

export async function searchStocks(query: string) {
  return fetchJson(`${BASE}/search?q=${encodeURIComponent(query)}&token=${KEY}`)
}

export async function getQuote(symbol: string): Promise<{ c: number; dp: number; h: number; l: number; o: number }> {
  return fetchJson(`${BASE}/quote?symbol=${symbol}&token=${KEY}`)
}

export async function getCompanyProfile(symbol: string) {
  return fetchJson(`${BASE}/stock/profile2?symbol=${symbol}&token=${KEY}`)
}

export async function getNewsForSymbol(symbol: string) {
  const to = new Date().toISOString().split('T')[0]
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  return fetchJson(`${BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${KEY}`)
}
