'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

interface AddAlertParams {
  symbol: string
  alert_type: 'price' | 'volume'
  condition: 'above' | 'below'
  threshold: number
}

export async function addAlert(params: AddAlertParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase.from('alerts').insert({
      user_id: userId,
      symbol: params.symbol.trim().toUpperCase(),
      alert_type: params.alert_type,
      condition: params.condition,
      threshold: Number(params.threshold),
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

export async function removeAlert(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

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
