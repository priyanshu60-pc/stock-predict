'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addAlert } from '@/lib/actions/alerts'

interface AlertFormData {
  alert_type: 'price' | 'volume'
  condition: 'above' | 'below'
  threshold: number
}

interface AlertFormProps {
  symbol: string
  userId: string
  onSuccess: () => void
}

export default function AlertForm({ symbol, userId, onSuccess }: AlertFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AlertFormData>({
    defaultValues: { alert_type: 'price', condition: 'above', threshold: 0 },
  })

  const onSubmit = async (data: AlertFormData) => {
    const result = await addAlert({ userId, symbol, ...data })
    if (result.success) {
      toast.success(`Alert set for ${symbol}!`)
      onSuccess()
    } else {
      toast.error(result.error ?? 'Failed to set alert')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-800/60 rounded-xl p-4 flex flex-col gap-3 border border-gray-700"
    >
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        Set Alert for {symbol}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Type</label>
          <select
            {...register('alert_type')}
            className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="price">Price (\$)</option>
            <option value="volume">Volume</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Condition</label>
          <select
            {...register('condition')}
            className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="above">Above ↑</option>
            <option value="below">Below ↓</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Threshold Value</label>
        <input
          type="number"
          step="0.01"
          {...register('threshold', { required: true, min: 0 })}
          placeholder="e.g. 200"
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-400"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="yellow-btn py-2 text-sm rounded-lg disabled:opacity-60"
      >
        {isSubmitting ? 'Setting alert…' : 'Set Alert'}
      </button>
    </form>
  )
}
