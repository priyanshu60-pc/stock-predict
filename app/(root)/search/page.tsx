'use client'

import { useState } from 'react'
import { Search, X, Loader2, Sparkles } from 'lucide-react'
import TradingViewWidget from '@/components/trading-view-widget'
import { WIDGET_BASE_URL, ADVANCED_CHART_CONFIG } from '@/lib/constants'

interface SearchResult {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [loading, setLoading] = useState(false)
  
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{confidenceScore: number, reasoning: string} | null>(null)

  const handleSearch = async (q: string) => {
    setQuery(q)
    if (q.length < 1) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.result?.slice(0, 8) ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const selectSymbol = (symbol: string) => {
    let formattedSymbol = symbol
    if (symbol.endsWith('.NS')) {
      formattedSymbol = `NSE:${symbol.replace('.NS', '')}`
    } else if (symbol.endsWith('.BO')) {
      formattedSymbol = `BSE:${symbol.replace('.BO', '')}`
    }
    
    setSelectedSymbol(formattedSymbol)
    setResults([])
    setQuery('')
    setAnalysisResult(null)
  }

  const handleAnalyze = async () => {
    setAnalysisLoading(true)
    setAnalysisResult(null)
    try {
      const res = await fetch(`/api/analyze?symbol=${encodeURIComponent(selectedSymbol)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysisResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setAnalysisLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Search Stocks</h1>
        <p className="text-gray-400 text-sm mt-1">
          Find any stock, ETF, or crypto
        </p>
      </div>

      {/* Search box */}
      <div className="relative max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for AAPL, Tesla, Bitcoin…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]) }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-white" />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {loading && (
              <p className="text-gray-400 text-sm p-4">Searching…</p>
            )}
            {results.map((r) => (
              <button
                key={r.symbol}
                onClick={() => selectSymbol(r.symbol)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors text-left"
              >
                <span className="text-white font-medium">{r.displaySymbol}</span>
                <span className="text-gray-400 text-sm truncate ml-4">{r.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Chart for selected symbol */}
      <div className="rounded-xl overflow-hidden border border-gray-800">
        <TradingViewWidget
          title={`Chart — ${selectedSymbol}`}
          scriptUrl={`${WIDGET_BASE_URL}advanced-chart.js`}
          config={{ ...ADVANCED_CHART_CONFIG, symbol: selectedSymbol }}
          height={600}
        />
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              AI Stock Analysis
            </h2>
            <p className="text-sm text-gray-400 mt-1">Get an instant buy-confidence score from Gemini AI.</p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={analysisLoading}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {analysisLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analysisLoading ? 'Analyzing...' : 'Analyze Stock'}
          </button>
        </div>

        {analysisResult && (
          <div className="mt-6 p-4 rounded-lg bg-gray-800 border border-gray-700">
            <div className="flex items-center gap-4 mb-3">
              <div className={`text-4xl font-black ${
                analysisResult.confidenceScore >= 8 ? 'text-green-400' :
                analysisResult.confidenceScore >= 5 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {analysisResult.confidenceScore}<span className="text-2xl text-gray-500">/10</span>
              </div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                Confidence Score
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg mt-4">
              {analysisResult.reasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
