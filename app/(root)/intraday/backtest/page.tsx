'use client'

import { useState } from 'react'
import { Calendar, Play, Percent, Activity, TrendingUp, Download } from 'lucide-react'

export default function BacktestPage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<{
    totalTrades: number,
    winRate: number,
    maxDrawdown: number,
    returnAfterCharges: number,
    buyAndHoldHdfc: number,
    buyAndHoldNifty: number
  } | null>(null)

  const handleRunBacktest = () => {
    setRunning(true)
    // Simulate backtest processing delay
    setTimeout(() => {
      setResults({
        totalTrades: 142,
        winRate: 62.5,
        maxDrawdown: -4.2,
        returnAfterCharges: 18.4,
        buyAndHoldHdfc: 12.1,
        buyAndHoldNifty: 14.5
      })
      setRunning(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Simulated Backtest</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Strategy</label>
            <select className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white">
              <option>Intraday Momentum (AI)</option>
              <option>SMA Crossover</option>
              <option>RSI Reversal</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
            <input type="date" defaultValue="2023-01-01" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">End Date</label>
            <input type="date" defaultValue="2023-12-31" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
          </div>
          <button 
            onClick={handleRunBacktest}
            disabled={running}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {running ? <Calendar className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? 'Simulating...' : 'Run Backtest'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 font-medium">Total Trades</p>
              <p className="text-3xl font-bold text-white mt-1">{results.totalTrades}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 font-medium">Win Rate</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-green-400">{results.winRate}%</p>
                <Percent className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 font-medium">Max Drawdown</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-red-400">{results.maxDrawdown}%</p>
                <Activity className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-400 font-medium">Net Return (After Charges)</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-yellow-400">+{results.returnAfterCharges}%</p>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Benchmark Comparison</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-white">Strategy Return</span>
                  <span className="text-sm font-medium text-yellow-400">+{results.returnAfterCharges}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Buy & Hold NIFTY 50</span>
                  <span className="text-sm font-medium text-gray-300">+{results.buyAndHoldNifty}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Buy & Hold HDFCBANK</span>
                  <span className="text-sm font-medium text-gray-300">+{results.buyAndHoldHdfc}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
             <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <Download className="w-4 h-4" />
               Export Trade Log (CSV)
             </button>
          </div>
        </>
      )}
    </div>
  )
}
