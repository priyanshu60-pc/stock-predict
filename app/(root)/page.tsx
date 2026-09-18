import TradingViewWidget from '@/components/trading-view-widget'
import {
  MARKET_OVERVIEW_CONFIG,
  HEATMAP_CONFIG,
  TOP_STORIES_CONFIG,
  MARKET_DATA_CONFIG,
  WIDGET_BASE_URL,
} from '@/lib/constants'

export default function DashboardPage() {
  return (
    <div className="home-wrapper">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Market Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Live market data — updated in real time
        </p>
      </div>

      {/* Section 1: Market Overview + Heatmap */}
      <section className="home-section">
        {/* Market Overview Chart */}
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${WIDGET_BASE_URL}market-overview.js`}
            config={MARKET_OVERVIEW_CONFIG}
            height={500}
            className="custom-chart"
          />
        </div>

        {/* Stock Heatmap */}
        <div className="md:col-span-2 xl:col-span-2">
          <TradingViewWidget
            title="Sector Heatmap"
            scriptUrl={`${WIDGET_BASE_URL}stock-heatmap.js`}
            config={HEATMAP_CONFIG}
            height={500}
            className="custom-chart"
          />
        </div>
      </section>

      {/* Section 2: Top Stories + Market Quotes */}
      <section className="home-section">
        {/* Top Stories / News */}
        <div className="md:col-span-2 xl:col-span-2">
          <TradingViewWidget
            scriptUrl={`${WIDGET_BASE_URL}timeline.js`}
            config={TOP_STORIES_CONFIG}
            height={500}
            className="custom-chart"
          />
        </div>

        {/* Market Quotes */}
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl={`${WIDGET_BASE_URL}market-quotes.js`}
            config={MARKET_DATA_CONFIG}
            height={500}
            className="custom-chart"
          />
        </div>
      </section>
    </div>
  )
}
