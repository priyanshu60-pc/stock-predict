'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

interface AddWatchlistParams {
  symbol: string
  companyName: string
}

export async function addToWatchlist({ symbol, companyName }: AddWatchlistParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const normalizedSymbol = symbol.trim().toUpperCase()
    const normalizedName = companyName.trim()

    if (!normalizedSymbol || !normalizedName) {
      return { success: false, error: 'Symbol and company name are required' }
    }

    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('symbol', normalizedSymbol)
      .maybeSingle()

    if (existing) {
      return { success: false, error: `${normalizedSymbol} is already in your watchlist` }
    }

    const { error } = await supabase.from('watchlist').insert({
      user_id: userId,
      symbol: normalizedSymbol,
      company_name: normalizedName,
    })

    if (error) throw error

    revalidatePath('/watchlist')
    return { success: true }
  } catch (err) {
    console.error('addToWatchlist error:', err)
    return { success: false, error: 'Failed to add stock' }
  }
}

export async function removeFromWatchlist(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    revalidatePath('/watchlist')
    return { success: true }
  } catch (err) {
    console.error('removeFromWatchlist error:', err)
    return { success: false, error: 'Failed to remove stock' }
  }
}
