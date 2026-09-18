'use client'

import { useState } from 'react'
import { Search, Loader2, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import TradingViewWidget from '@/components/trading-view-widget'
import { WIDGET_BASE_URL, INTRADAY_CHART_CONFIG } from '@/lib/constants'

interface IntradayAnalysisResult {
  signal: 'Bullish' | 'Bearish' | 'Neutral'
  confidenceScore: number
  reasoning: string
}

export default function IntradayDashboard() {
  const [symbol, setSymbol] = useState('NSE:HDFCBANK')
  const [inputSymbol, setInputSymbol] = useState('NSE:HDFCBANK')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<IntradayAnalysisResult | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setAnalysisResult(null)
    try {
      const res = await fetch(`/api/analyze/intraday?symbol=${encodeURIComponent(symbol)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysisResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSymbol(inputSymbol.toUpperCase())
    setAnalysisResult(null)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Intraday Setup</h2>
          <p className="text-sm text-gray-400">Analysis & 5-minute charts</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            placeholder="e.g. NSE:RELIANCE"
            className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400"
          />
        </form>
      </div>

      {/* Overview Stats (Simulated for MVP) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-medium">Last Price (Sim)</p>
          <p className="text-2xl font-bold text-white mt-1">₹1,642.50</p>
          <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1.2%</span>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-medium">Volume (Sim)</p>
          <p className="text-2xl font-bold text-white mt-1">12.4M</p>
          <p className="text-gray-500 text-sm mt-1">Avg: 10.1M</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-medium">Signal Badge</p>
          <div className="mt-1 flex items-center gap-2">
            {analysisResult ? (
              <>
                {analysisResult.signal === 'Bullish' && <TrendingUp className="h-6 w-6 text-green-400" />}
                {analysisResult.signal === 'Bearish' && <TrendingDown className="h-6 w-6 text-red-400" />}
                {analysisResult.signal === 'Neutral' && <Minus className="h-6 w-6 text-yellow-400" />}
                <span className={`text-xl font-bold ${
                  analysisResult.signal === 'Bullish' ? 'text-green-400' :
                  analysisResult.signal === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {analysisResult.signal}
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-xl font-bold">Awaiting Scan</span>
            )}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-medium">Confidence Score</p>
          {analysisResult ? (
            <p className="text-3xl font-black text-white mt-1">
              {analysisResult.confidenceScore}<span className="text-lg text-gray-500 font-normal">/100</span>
            </p>
          ) : (
            <p className="text-3xl font-black text-gray-700 mt-1">--/100</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="xl:col-span-2 rounded-xl overflow-hidden border border-gray-800 bg-gray-950 h-[600px]">
          <TradingViewWidget
            title={`5-Min Chart — ${symbol}`}
            scriptUrl={`${WIDGET_BASE_URL}advanced-chart.js`}
            config={{ ...INTRADAY_CHART_CONFIG, symbol }}
            height={560}
          />
        </div>

        {/* AI Signal Analysis */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              AI Intraday Scanner
            </h3>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run Scan'}
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
              <p>Analyzing 5-minute data structure...</p>
            </div>
          ) : analysisResult ? (
            <div className="flex-1 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Signal Explanation</h4>
              <div className="prose prose-invert prose-sm">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{analysisResult.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-center px-4">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p>Run a scan to generate an AI-powered intraday signal based on current momentum, RSI, and volume.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
