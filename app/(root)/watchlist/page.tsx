import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import WatchlistCard from '@/components/watchlist-card'
import AddToWatchlistForm from '@/components/forms/add-watchlist-form'

export default async function WatchlistPage() {
  const { userId } = await auth()
  if (!userId) return null

  // Fetch watchlist from Supabase
  const { data: watchlist } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  // Fetch alerts from Supabase
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your favourite stocks and set price alerts
          </p>
        </div>
        <AddToWatchlistForm userId={userId} />
      </div>

      {/* Watchlist grid */}
      {watchlist && watchlist.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <WatchlistCard
              key={item.id}
              item={item}
              alerts={alerts?.filter((a) => a.symbol === item.symbol) ?? []}
              userId={userId}
            />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">📊</span>
          <h2 className="text-xl font-semibold text-white">
            Your watchlist is empty
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xs">
            Add stocks you want to track and set price alerts to stay on top of
            the market.
          </p>
        </div>
      )}
    </div>
  )
}
