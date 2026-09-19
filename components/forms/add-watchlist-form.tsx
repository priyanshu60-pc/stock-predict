'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { addToWatchlist } from '@/lib/actions/watchlist'

interface FormData {
  symbol: string
  company_name: string
}

export default function AddToWatchlistForm() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const result = await addToWatchlist({
      symbol: data.symbol,
      companyName: data.company_name,
    })

    if (result.success) {
      toast.success(`${data.symbol.toUpperCase().trim()} added to watchlist!`)
      reset()
      setOpen(false)
    } else {
      toast.error(result.error ?? 'Failed to add stock')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
      >
        <Plus className="h-4 w-4" />
        Add Stock
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-4">Add to Watchlist</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-sm font-medium">
                  Ticker Symbol
                </label>
                <input
                  {...register('symbol', { required: true })}
                  placeholder="e.g. AAPL, TSLA, NVDA"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 text-sm uppercase"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-sm font-medium">
                  Company Name
                </label>
                <input
                  {...register('company_name', { required: true })}
                  placeholder="e.g. Apple Inc."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 yellow-btn py-2.5 rounded-xl text-sm disabled:opacity-60"
                >
                  {isSubmitting ? 'Adding…' : 'Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
