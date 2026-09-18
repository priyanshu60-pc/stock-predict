'use client'

import { useState } from 'react'
import { Trash2, Bell, BellOff, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { removeFromWatchlist } from '@/lib/actions/watchlist'
import { removeAlert } from '@/lib/actions/alerts'
import AlertForm from './forms/alert-form'
import TradingViewWidget from './trading-view-widget'
import { WIDGET_BASE_URL, MINI_CHART_CONFIG } from '@/lib/constants'

interface WatchlistItem {
  id: string
  symbol: string
  company_name: string
  user_id: string
}

interface Alert {
  id: string
  symbol: string
  condition: string
  threshold: number
  alert_type: string
  active: boolean
}

interface WatchlistCardProps {
  item: WatchlistItem
  alerts: Alert[]
  userId: string
}

export default function WatchlistCard({ item, alerts, userId }: WatchlistCardProps) {
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    const result = await removeFromWatchlist(item.id, userId)
    if (result.success) {
      toast.success(`${item.symbol} removed from watchlist`)
    } else {
      toast.error('Failed to remove stock')
      setIsRemoving(false)
    }
  }

  const handleRemoveAlert = async (alertId: string) => {
    const result = await removeAlert(alertId, userId)
    if (result.success) {
      toast.success('Alert removed')
    } else {
      toast.error('Failed to remove alert')
    }
  }

  return (
    <div className="stock-card flex flex-col gap-4">
      {/* Stock header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">{item.symbol}</h3>
          <p className="text-gray-400 text-sm truncate max-w-[160px]">
            {item.company_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAlertForm(!showAlertForm)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-yellow-400/10 text-gray-400 hover:text-yellow-400 transition-colors"
            title="Add alert"
          >
            {showAlertForm ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-400/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
            title="Remove from watchlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mini TradingView chart */}
      <div className="rounded-lg overflow-hidden bg-gray-950 h-32">
        <TradingViewWidget
          scriptUrl={`${WIDGET_BASE_URL}mini-symbol-overview.js`}
          config={{ ...MINI_CHART_CONFIG, symbol: item.symbol }}
          height={128}
        />
      </div>

      {/* Alert form */}
      {showAlertForm && (
        <AlertForm
          symbol={item.symbol}
          userId={userId}
          onSuccess={() => setShowAlertForm(false)}
        />
      )}

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Active Alerts
          </p>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                {alert.condition === 'above' ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                )}
                <span className="text-gray-300 text-xs">
                  {alert.alert_type === 'price' ? '\$' : ''}
                  {alert.threshold.toLocaleString()}{' '}
                  <span className="text-gray-500">
                    ({alert.condition} trigger)
                  </span>
                </span>
              </div>
              <button
                onClick={() => handleRemoveAlert(alert.id)}
                className="text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
