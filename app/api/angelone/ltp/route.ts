import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getLTP } from '@/lib/angelone'

/**
 * GET /api/angelone/ltp?exchange=NSE&tokens=3045,1594
 *
 * Returns LTP data for the given symbol tokens on the given exchange.
 */
export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const exchange = searchParams.get('exchange') ?? 'NSE'
  const tokens = searchParams.get('tokens')

  if (!tokens) {
    return NextResponse.json(
      { error: 'Missing required query param: tokens' },
      { status: 400 }
    )
  }

  const tokenList = tokens.split(',').map((t) => t.trim())

  try {
    const data = await getLTP({ [exchange]: tokenList })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
