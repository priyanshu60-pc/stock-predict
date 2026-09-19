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

    container.innerHTML = ''
    delete container.dataset.loaded

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    widgetContainer.style.width = '100%'
    widgetContainer.style.height = `${height}px`
    container.appendChild(widgetContainer)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = scriptUrl
    script.async = true

    script.onload = () => {
      if (!window.TradingView) return

      const initScript = document.createElement('script')
      initScript.type = 'text/javascript'
      initScript.textContent = `
        new TradingView.widget({
          ...${JSON.stringify({ ...config, width: '100%', height, autosize: true })}
        });
      `
      container.appendChild(initScript)
      container.dataset.loaded = 'true'
    }

    script.onerror = () => {
      console.error('Failed to load TradingView script:', scriptUrl)
    }

    container.appendChild(script)

    return () => {
      if (container) {
        container.innerHTML = ''
        delete container.dataset.loaded
      }
    }
  }, [scriptUrl, configKey, height])

  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>}
      <div ref={containerRef} className="tradingview-widget-container" style={{ height }} />
    </div>
  )
}
