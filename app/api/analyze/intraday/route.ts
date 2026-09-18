import { NextResponse } from 'next/server'
import { analyzeIntradaySetup } from '@/lib/gemini'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 })
  }

  try {
    const result = await analyzeIntradaySetup(symbol)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to analyze intraday setup:', error)
    return NextResponse.json(
      { error: 'Intraday analysis failed' },
      { status: 500 }
    )
  }
}
