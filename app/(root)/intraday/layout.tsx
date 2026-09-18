import Link from 'next/link'
import { ReactNode } from 'react'

export default function IntradayLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white mr-4">Intraday Setup</h1>
        <nav className="flex gap-4">
          <Link href="/intraday" className="text-gray-400 hover:text-white font-medium transition-colors">
            Analysis
          </Link>
          <Link href="/intraday/paper-trading" className="text-gray-400 hover:text-white font-medium transition-colors">
            Paper Trading
          </Link>
          <Link href="/intraday/backtest" className="text-gray-400 hover:text-white font-medium transition-colors">
            Backtest (Sim)
          </Link>
        </nav>
      </div>
      {children}
    </div>
  )
}
