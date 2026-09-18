'use client'

import { Holding } from '@/lib/angelone'
import { TrendingUp, TrendingDown } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

function pct(n: number) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

interface Props {
  holdings: Holding[]
  totals: {
    totalholdingvalue: number
    totalinvvalue: number
    totalprofitandloss: number
    totalpnlpercentage: number
  }
}

export default function HoldingsTable({ holdings, totals }: Props) {
  const isProfit = totals.totalprofitandloss >= 0

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Current Value"
          value={fmt(totals.totalholdingvalue)}
          accent="text-white"
        />
        <SummaryCard
          label="Invested Value"
          value={fmt(totals.totalinvvalue)}
          accent="text-gray-300"
        />
        <SummaryCard
          label="Total P&L"
          value={fmt(totals.totalprofitandloss)}
          accent={isProfit ? 'text-emerald-400' : 'text-red-400'}
        />
        <SummaryCard
          label="Returns"
          value={pct(totals.totalpnlpercentage)}
          accent={isProfit ? 'text-emerald-400' : 'text-red-400'}
          icon={
            isProfit ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )
          }
        />
      </div>

      {/* Table */}
      {holdings.length === 0 ? (
        <EmptyState message="No holdings found in your Demat account." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Avg Price</th>
                <th className="px-4 py-3 text-right">LTP</th>
                <th className="px-4 py-3 text-right">Current Value</th>
                <th className="px-4 py-3 text-right">P&L</th>
                <th className="px-4 py-3 text-right">Return %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holdings.map((h) => {
                const gain = h.profitandloss >= 0
                return (
                  <tr
                    key={h.symboltoken}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {h.tradingsymbol}
                        </span>
                        <span className="text-xs text-gray-500">
                          {h.exchange} · {h.isin}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-200">
                      {h.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-200">
                      {fmt(h.averageprice)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {fmt(h.ltp)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-200">
                      {fmt(h.ltp * h.quantity)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        gain ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {gain ? '+' : ''}
                      {fmt(h.profitandloss)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          gain
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {gain ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {pct(h.pnlpercentage)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string
  value: string
  accent: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${accent} flex items-center gap-1.5`}>
        {icon}
        {value}
      </p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-3">📂</span>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}
