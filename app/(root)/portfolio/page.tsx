import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { getHoldings, getPositions } from '@/lib/angelone'
import HoldingsTable from '@/components/holdings-table'
import PositionsTable from '@/components/positions-table'
import { BriefcaseBusiness, LayoutList, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portfolio | Stocks App',
  description: 'Your AngelOne portfolio — real-time holdings and positions',
}

type Tab = 'holdings' | 'positions'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const { userId } = await auth()
  if (!userId) return null

  const params = await searchParams
  const activeTab: Tab =
    params.tab === 'positions' ? 'positions' : 'holdings'

  let holdingsData: Awaited<ReturnType<typeof getHoldings>> | null = null
  let positionsData: Awaited<ReturnType<typeof getPositions>> | null = null
  let error: string | null = null

  try {
    if (activeTab === 'holdings') {
      holdingsData = await getHoldings()
    } else {
      positionsData = await getPositions()
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data from AngelOne'
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
            <BriefcaseBusiness className="w-5 h-5 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          Live data from your AngelOne Demat account
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <TabLink
          href="/portfolio?tab=holdings"
          label="Holdings"
          icon={<BriefcaseBusiness className="w-4 h-4" />}
          active={activeTab === 'holdings'}
        />
        <TabLink
          href="/portfolio?tab=positions"
          label="Positions"
          icon={<LayoutList className="w-4 h-4" />}
          active={activeTab === 'positions'}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300 mb-1">
              Failed to connect to AngelOne
            </p>
            <p className="text-red-400/80 font-mono text-xs">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Make sure{' '}
              <code className="bg-white/10 px-1 rounded">ANGEL_API_KEY</code>,{' '}
              <code className="bg-white/10 px-1 rounded">ANGEL_CLIENT_ID</code>,{' '}
              <code className="bg-white/10 px-1 rounded">ANGEL_MPIN</code>, and{' '}
              <code className="bg-white/10 px-1 rounded">ANGEL_TOTP_SECRET</code>{' '}
              are set in your <code className="bg-white/10 px-1 rounded">.env.local</code>.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!error && activeTab === 'holdings' && holdingsData && (
        <HoldingsTable
          holdings={holdingsData.holdings ?? []}
          totals={
            holdingsData.totalholding ?? {
              totalholdingvalue: 0,
              totalinvvalue: 0,
              totalprofitandloss: 0,
              totalpnlpercentage: 0,
            }
          }
        />
      )}

      {!error && activeTab === 'positions' && positionsData && (
        <PositionsTable positions={positionsData ?? []} />
      )}
    </div>
  )
}

function TabLink({
  href,
  label,
  icon,
  active,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/25'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </a>
  )
}
