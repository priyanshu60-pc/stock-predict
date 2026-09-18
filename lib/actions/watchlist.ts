'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

interface AddWatchlistParams {
  userId: string
  symbol: string
  companyName: string
}

export async function addToWatchlist({ userId, symbol, companyName }: AddWatchlistParams) {
  try {
    // Check for duplicates
    const { data: existing } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .single()

    if (existing) {
      return { success: false, error: `${symbol} is already in your watchlist` }
    }

    const { error } = await supabase.from('watchlist').insert({
      user_id: userId,
      symbol,
      company_name: companyName,
    })

    if (error) throw error

    revalidatePath('/watchlist')
    return { success: true }
  } catch (err) {
    console.error('addToWatchlist error:', err)
    return { success: false, error: 'Failed to add stock' }
  }
}

export async function removeFromWatchlist(id: string, userId: string) {
  try {
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
