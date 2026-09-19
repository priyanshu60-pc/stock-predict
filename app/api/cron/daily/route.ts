import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getQuote } from '@/lib/finnhub'
import { generateDailyDigest } from '@/lib/gemini'
import { sendAlertEmail, sendDailyDigest } from '@/lib/resend'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Running daily market digest cron job...')

  try {
    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('active', true)

    const { data: watchlistItems } = await supabase
      .from('watchlist')
      .select('user_id, symbol')

    if (!alerts || !watchlistItems) {
      return NextResponse.json({ ok: true, message: 'No data to process' })
    }

    const symbols = [...new Set([
      ...alerts.map((a: { symbol: string }) => a.symbol),
      ...watchlistItems.map((w: { symbol: string }) => w.symbol),
    ])]

    const quotes: Record<string, { price: number; change: number }> = {}
    await Promise.allSettled(
      symbols.map(async (symbol) => {
        const q = await getQuote(symbol)
        if (q?.c) quotes[symbol] = { price: q.c, change: q.dp }
      })
    )

    const alertsToFire = alerts.filter((alert: { symbol: string; condition: string; threshold: number; id: string }) => {
      const quote = quotes[alert.symbol]
      if (!quote) return false
      return alert.condition === 'above'
        ? quote.price >= alert.threshold
        : quote.price <= alert.threshold
    })

    const { data: userEmails } = await supabase
      .from('user_emails')
      .select('user_id, email, name')

    const emailMap: Record<string, { email: string; name: string }> = {}
    userEmails?.forEach((u: { user_id: string; email: string; name: string }) => {
      emailMap[u.user_id] = { email: u.email, name: u.name }
    })

    await Promise.allSettled(
      alertsToFire.map(async (alert: { user_id: string; symbol: string; condition: string; threshold: number; alert_type: string; id: string }) => {
        const user = emailMap[alert.user_id]
        if (!user) return
        const quote = quotes[alert.symbol]
        if (!quote) return

        await sendAlertEmail({
          to: user.email,
          symbol: alert.symbol,
          condition: alert.condition,
          threshold: alert.threshold,
          currentPrice: quote.price,
          alertType: alert.alert_type,
        })
      })
    )

    const alertIdsToDeactivate = alertsToFire.map((alert) => alert.id)
    if (alertIdsToDeactivate.length > 0) {
      await supabase
        .from('alerts')
        .update({ active: false })
        .in('id', alertIdsToDeactivate)
    }

    const userSymbols: Record<string, string[]> = {}
    watchlistItems.forEach((item: { user_id: string; symbol: string }) => {
      if (!userSymbols[item.user_id]) userSymbols[item.user_id] = []
      userSymbols[item.user_id].push(item.symbol)
    })

    await Promise.allSettled(
      Object.entries(userSymbols).map(async ([userId, syms]) => {
        const user = emailMap[userId]
        if (!user || syms.length === 0) return

        const digestHtml = await generateDailyDigest(syms, quotes)

        await sendDailyDigest({
          to: user.email,
          name: user.name,
          digestHtml,
          stockLines: syms.map((s) => {
            const q = quotes[s]
            if (!q) return `${s}: unavailable`
            const arrow = q.change >= 0 ? '▲' : '▼'
            return `${s}: $${q.price.toFixed(2)} ${arrow} ${Math.abs(q.change).toFixed(2)}%`
          }),
        })
      })
    )

    return NextResponse.json({
      ok: true,
      alertsFired: alertsToFire.length,
      digestsSent: Object.keys(userSymbols).length,
    })
  } catch (err) {
    console.error('Cron job error:', err)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
