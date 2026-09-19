'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TradingViewWidgetProps {
  title?: string
  scriptUrl: string
  config: Record<string, unknown>
  height?: number
  className?: string
}

export default function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 500,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const configKey = JSON.stringify(config)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.replaceChildren()

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    widgetContainer.style.width = '100%'
    widgetContainer.style.height = `${height}px`

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = scriptUrl
    script.async = true
    // TradingView's external-embedding scripts parse their own inline JSON.
    // Do not append a second empty script or call TradingView.widget manually.
    script.textContent = JSON.stringify({
      ...config,
      width: '100%',
      height,
      autosize: true,
    })

    container.append(widgetContainer, script)

    return () => {
      container.replaceChildren()
    }
  }, [scriptUrl, configKey, height])

  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>}
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height }}
      />
    </div>
  )
}
