// -- Navigation -------------------------------------------
export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/intraday', label: 'Intraday' },
] as const

// -- TradingView ------------------------------------------
export const WIDGET_BASE_URL =
  'https://s3.tradingview.com/external-embedding/embed-widget-'

export const MARKET_OVERVIEW_CONFIG = {
  colorTheme: 'dark',
  dateRange: '12M',
  showChart: true,
  locale: 'en',
  largeChartUrl: '',
  isTransparent: false,
  showSymbolLogo: true,
  showFloatingTooltip: false,
  width: '100%',
  plotLineColorGrowing: 'rgba(250, 204, 21, 1)',
  plotLineColorFalling: 'rgba(239, 68, 68, 1)',
  gridLineColor: 'rgba(255, 255, 255, 0.06)',
  scaleFontColor: 'rgba(148, 163, 184, 1)',
  belowLineFillColorGrowing: 'rgba(250, 204, 21, 0.12)',
  belowLineFillColorFalling: 'rgba(239, 68, 68, 0.12)',
  symbolActiveColor: 'rgba(250, 204, 21, 0.12)',
  tabs: [
    {
      title: 'Indices',
      symbols: [
        { s: 'FOREXCOM:SPXUSD', d: 'S&P 500 Index' },
        { s: 'FOREXCOM:NSXUSD', d: 'US 100 Cash CFD' },
        { s: 'FOREXCOM:DJI', d: 'Dow Jones Index' },
        { s: 'INDEX:NKY', d: 'Japan 225' },
        { s: 'INDEX:DEU40', d: 'Germany 40' },
      ],
      originalTitle: 'Indices',
    },
    {
      title: 'Crypto',
      symbols: [
        { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
        { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
      ],
      originalTitle: 'Crypto',
    },
  ],
}

export const HEATMAP_CONFIG = {
  exchanges: [],
  dataSource: 'SPX500',
  grouping: 'sector',
  blockSize: 'market_cap_basic',
  blockColor: 'change',
  locale: 'en',
  symbolUrl: '',
  colorTheme: 'dark',
  hasTopBar: false,
  isDataSetAdaptive: false,
  width: '100%',
}

export const TOP_STORIES_CONFIG = {
  feedMode: 'all_symbols',
  colorTheme: 'dark',
  isTransparent: false,
  displayMode: 'adaptive',
  width: '100%',
  locale: 'en',
}

export const MARKET_DATA_CONFIG = {
  width: '100%',
  colorTheme: 'dark',
  locale: 'en',
  symbolsGroups: [
    {
      name: 'Indices',
      originalName: 'Indices',
      symbols: [
        { name: 'FOREXCOM:SPXUSD', displayName: 'S&P 500' },
        { name: 'FOREXCOM:NSXUSD', displayName: 'US 100' },
        { name: 'FOREXCOM:DJI', displayName: 'Dow Jones' },
      ],
    },
    {
      name: 'Commodities',
      originalName: 'Commodities',
      symbols: [
        { name: 'CME_MINI:ES1!', displayName: 'E-Mini S&P' },
        { name: 'CME:6E1!', displayName: 'Euro' },
        { name: 'COMEX:GC1!', displayName: 'Gold' },
        { name: 'NYMEX:CL1!', displayName: 'Crude Oil' },
      ],
    },
    {
      name: 'Crypto',
      originalName: 'Crypto',
      symbols: [
        { name: 'BITSTAMP:BTCUSD', displayName: 'Bitcoin' },
        { name: 'BITSTAMP:ETHUSD', displayName: 'Ethereum' },
      ],
    },
  ],
}

export const ADVANCED_CHART_CONFIG = {
  autosize: true,
  symbol: 'AAPL',
  interval: 'D',
  timezone: 'Etc/UTC',
  theme: 'dark',
  style: '1',
  locale: 'en',
  allow_symbol_change: true,
  calendar: false,
  support_host: 'https://www.tradingview.com',
}

export const MINI_CHART_CONFIG = {
  symbol: "AAPL",
  width: "100%",
  height: "100%",
  locale: "en",
  dateRange: "1M",
  colorTheme: "dark",
  isTransparent: true,
  autosize: true,
  largeChartUrl: ""
}

export const INTRADAY_CHART_CONFIG = {
  autosize: true,
  symbol: 'NSE:HDFCBANK',
  interval: '5',
  timezone: 'Asia/Kolkata',
  theme: 'dark',
  style: '1',
  locale: 'en',
  allow_symbol_change: true,
  calendar: false,
  support_host: 'https://www.tradingview.com',
  studies: [
    'MASimple@tv-basicstudies',
    'RSI@tv-basicstudies',
    'MACD@tv-basicstudies'
  ]
}
