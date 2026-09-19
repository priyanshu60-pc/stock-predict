'use client'

import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, BookOpen, Target, ShieldAlert } from 'lucide-react'

interface Trade {
  id: string
  symbol: string
  type: 'LONG' | 'SHORT'
  entry: number
  quantity: number
  stopLoss: number
  target: number
  status: 'OPEN' | 'CLOSED'
  pnl?: number
  journal: string
  date: string
}

const PAPER_STORAGE_KEY = 'paper_trading_state'

export default function PaperTradingPage() {
  const [balance, setBalance] = useState(100000)
  const [trades, setTrades] = useState<Trade[]>([])
  const [isClient, setIsClient] = useState(false)

  const [symbol, setSymbol] = useState('NSE:HDFCBANK')
  const [type, setType] = useState<'LONG' | 'SHORT'>('LONG')
  const [entry, setEntry] = useState(1642.5)
  const [quantity, setQuantity] = useState(10)
  const [stopLoss, setStopLoss] = useState(1630)
  const [target, setTarget] = useState(1670)
  const [journal, setJournal] = useState('')

  useEffect(() => {
    setIsClient(true)
    const savedState = localStorage.getItem(PAPER_STORAGE_KEY)
    if (!savedState) return

    try {
      const parsed = JSON.parse(savedState) as { balance?: number; trades?: Trade[] }
      if (typeof parsed.balance === 'number') setBalance(parsed.balance)
      if (Array.isArray(parsed.trades)) setTrades(parsed.trades)
    } catch {
      localStorage.removeItem(PAPER_STORAGE_KEY)
    }
  }, [])

  const saveState = (newBalance: number, newTrades: Trade[]) => {
    setBalance(newBalance)
    setTrades(newTrades)
    localStorage.setItem(PAPER_STORAGE_KEY, JSON.stringify({ balance: newBalance, trades: newTrades }))
  }

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedEntry = Number(entry)
    const sanitizedQuantity = Number(quantity)
    const sanitizedStopLoss = Number(stopLoss)
    const sanitizedTarget = Number(target)

    if (!symbol.trim() || !Number.isFinite(sanitizedEntry) || sanitizedEntry <= 0) {
      alert('Please enter a valid entry price.')
      return
    }

    if (!Number.isFinite(sanitizedQuantity) || sanitizedQuantity <= 0 || !Number.isInteger(sanitizedQuantity)) {
      alert('Please enter a valid positive integer quantity.')
      return
    }

    if (!Number.isFinite(sanitizedStopLoss) || !Number.isFinite(sanitizedTarget)) {
      alert('Please enter valid stop-loss and target values.')
      return
    }

    const cost = sanitizedEntry * sanitizedQuantity
    if (cost > balance) {
      alert('Insufficient virtual balance')
      return
    }

    const newTrade: Trade = {
      id: Math.random().toString(36).slice(2, 11),
      symbol: symbol.trim(),
      type,
      entry: sanitizedEntry,
      quantity: sanitizedQuantity,
      stopLoss: sanitizedStopLoss,
      target: sanitizedTarget,
      status: 'OPEN',
      journal: journal.trim(),
      date: new Date().toISOString(),
    }

    saveState(balance - cost, [newTrade, ...trades])
    setJournal('')
  }

  const handleClose = (tradeId: string, currentPrice: number) => {
    const parsedPrice = Number(currentPrice)
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert('Please enter a valid exit price.')
      return
    }

    const trade = trades.find((t) => t.id === tradeId)
    if (!trade) return

    const updatedTrades = trades.map((t) => {
      if (t.id !== tradeId || t.status !== 'OPEN') return t

      const pnl = t.type === 'LONG'
        ? (parsedPrice - t.entry) * t.quantity
        : (t.entry - parsedPrice) * t.quantity

      return {
        ...t,
        status: 'CLOSED' as const,
        pnl,
        date: t.date,
      }
    })

    const closedTrade = updatedTrades.find((t) => t.id === tradeId)
    const realized = closedTrade?.pnl ?? 0
    const newBalance = balance + trade.entry * trade.quantity + realized

    saveState(newBalance, updatedTrades)
  }

  if (!isClient) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="flex flex-col gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Wallet className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-gray-400 font-medium">Virtual Buying Power</h2>
          </div>
          <p className="text-4xl font-black text-white">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <form onSubmit={handleExecute} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white mb-2">Execute Paper Trade</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Symbol</label>
              <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'LONG' | 'SHORT')} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white">
                <option value="LONG">Long (Buy)</option>
                <option value="SHORT">Short (Sell)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Entry Price (₹)</label>
              <input type="number" step="0.05" value={entry} onChange={(e) => setEntry(Number(e.target.value))} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Quantity</label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-400" /> Stop Loss</label>
              <input type="number" step="0.05" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 flex items-center gap-1"><Target className="w-3 h-3 text-green-400" /> Target</label>
              <input type="number" step="0.05" value={target} onChange={(e) => setTarget(Number(e.target.value))} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3 text-blue-400" /> Decision Journal</label>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Why are you taking this trade?"
              required
              rows={3}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white resize-none"
            />
          </div>

          <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${type === 'LONG' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
            Execute {type} Trade
          </button>
        </form>
      </div>

      <div className="xl:col-span-2 flex flex-col gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trade Log & Journal</h3>

          {trades.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No paper trades executed yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {trades.map((trade) => (
                <div key={trade.id} className="border border-gray-800 rounded-xl p-4 bg-gray-950 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${trade.type === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {trade.type}
                        </span>
                        <span className="text-white font-bold">{trade.symbol}</span>
                        <span className="text-gray-500 text-sm">x{trade.quantity}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Entry: ₹{trade.entry.toFixed(2)} | SL: ₹{trade.stopLoss.toFixed(2)} | TGT: ₹{trade.target.toFixed(2)}</p>
                    </div>
                    {trade.status === 'OPEN' ? (
                      <button
                        onClick={() => {
                          const exitPrice = window.prompt('Simulate Exit Price (₹):', trade.entry.toString())
                          if (exitPrice !== null) handleClose(trade.id, Number(exitPrice))
                        }}
                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-3 py-1 rounded text-sm font-semibold transition-colors"
                      >
                        Close Position
                      </button>
                    ) : (
                      <div className={`text-right font-bold ${trade.pnl! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pnl! >= 0 ? '+' : ''}₹{trade.pnl!.toFixed(2)}
                        <p className="text-xs text-gray-500 font-normal mt-0.5">CLOSED</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <p className="text-sm text-gray-400 italic">"{trade.journal}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
