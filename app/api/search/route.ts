import { NextResponse } from 'next/server'
import { searchStocks } from '@/lib/finnhub'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) return NextResponse.json({ result: [] })

  try {
    const data = await searchStocks(q)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ result: [] }, { status: 500 })
  }
}
