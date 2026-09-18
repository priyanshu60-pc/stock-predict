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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (container.dataset.loaded) return

    // Clear and rebuild
    container.innerHTML = `<div class="tradingview-widget-container__widget" style="width:100%;height:${height}px"></div>`

    const script = document.createElement('script')
    script.src = scriptUrl
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({ ...config, height, autosize: true })
    container.dataset.loaded = 'true'
    container.appendChild(script)

    return () => {
      if (container) {
        container.innerHTML = ''
        delete container.dataset.loaded
      }
    }
  }, [scriptUrl, config, height])

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      )}
      <div ref={containerRef} className="tradingview-widget-container" style={{ height }} />
    </div>
  )
}
