import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { StockMovement } from '../types'

export function useStockMovements(productId?: string) {
  return useQuery<StockMovement[]>({
    queryKey: ['stock-movements', { productId }],
    queryFn: async () => {
      const params = productId ? { product_id: productId } : {}
      const { data } = await api.get<StockMovement[]>('/stock-movements', { params })
      return data
    },
  })
}

export interface StockMovementPayload {
  product_id: string
  movement_type: 'in' | 'out'
  quantity: number
  reason?: string | null
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: StockMovementPayload) => {
      const { data } = await api.post<StockMovement>('/stock-movements', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
