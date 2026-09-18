'use client'

import { Position } from '@/lib/angelone'
import { TrendingUp, TrendingDown } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

interface Props {
  positions: Position[]
}

export default function PositionsTable({ positions }: Props) {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-3">📋</span>
        <p className="text-gray-400 text-sm">
          No open positions for today.
        </p>
      </div>
    )
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0)
  const totalRealised = positions.reduce((sum, p) => sum + p.realised, 0)
  const totalUnrealised = positions.reduce((sum, p) => sum + p.unrealised, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          label="Total P&L"
          value={fmt(totalPnL)}
          gain={totalPnL >= 0}
        />
        <SummaryCard
          label="Realised"
          value={fmt(totalRealised)}
          gain={totalRealised >= 0}
        />
        <SummaryCard
          label="Unrealised"
          value={fmt(totalUnrealised)}
          gain={totalUnrealised >= 0}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Buy Qty</th>
              <th className="px-4 py-3 text-right">Sell Qty</th>
              <th className="px-4 py-3 text-right">Net Qty</th>
              <th className="px-4 py-3 text-right">LTP</th>
              <th className="px-4 py-3 text-right">Realised P&L</th>
              <th className="px-4 py-3 text-right">Unrealised P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {positions.map((p) => {
              const gainR = p.realised >= 0
              const gainU = p.unrealised >= 0
              return (
                <tr
                  key={`${p.symboltoken}-${p.producttype}`}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {p.tradingsymbol}
                      </span>
                      <span className="text-xs text-gray-500">{p.exchange}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                      {p.producttype}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-200">
                    {p.buyqty}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-200">
                    {p.sellqty}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold ${
                        p.netqty > 0
                          ? 'text-emerald-400'
                          : p.netqty < 0
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {p.netqty > 0 ? '+' : ''}
                      {p.netqty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-medium">
                    {fmt(p.ltp)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      gainR ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {gainR ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {gainR ? '+' : ''}
                      {fmt(p.realised)}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      gainU ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {gainU ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {gainU ? '+' : ''}
                      {fmt(p.unrealised)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  gain,
}: {
  label: string
  value: string
  gain: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-lg font-bold flex items-center gap-1.5 ${
          gain ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {gain ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        {value}
      </p>
    </div>
  )
}
