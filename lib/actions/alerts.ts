'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

interface AddAlertParams {
  userId: string
  symbol: string
  alert_type: 'price' | 'volume'
  condition: 'above' | 'below'
  threshold: number
}

export async function addAlert(params: AddAlertParams) {
  try {
    const { error } = await supabase.from('alerts').insert({
      user_id: params.userId,
      symbol: params.symbol,
      alert_type: params.alert_type,
      condition: params.condition,
      threshold: params.threshold,
      active: true,
    })

    if (error) throw error

    revalidatePath('/watchlist')
    return { success: true }
  } catch (err) {
    console.error('addAlert error:', err)
    return { success: false, error: 'Failed to set alert' }
  }
}

export async function removeAlert(id: string, userId: string) {
  try {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    revalidatePath('/watchlist')
    return { success: true }
  } catch (err) {
    console.error('removeAlert error:', err)
    return { success: false, error: 'Failed to remove alert' }
  }
}
