import { NextResponse } from 'next/server'
import { analyzeStockConfidence } from '@/lib/gemini'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 })
  }

  try {
    const result = await analyzeStockConfidence(symbol)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to analyze stock:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
