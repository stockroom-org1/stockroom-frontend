import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Product } from '../types'

export function useProducts(categoryId?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', { categoryId }],
    queryFn: async () => {
      const params = categoryId ? { category_id: categoryId } : {}
      const { data } = await api.get<Product[]>('/products', { params })
      return data
    },
  })
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export interface ProductPayload {
  sku: string
  name: string
  category_id?: string | null
  description?: string | null
  unit_price: string
  quantity_in_stock: number
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await api.post<Product>('/products', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: ProductPayload & { id: string }) => {
      const { data } = await api.put<Product>(`/products/${id}`, payload)
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
