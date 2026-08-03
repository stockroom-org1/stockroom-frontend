export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category_id: string | null
  description: string | null
  unit_price: string
  quantity_in_stock: number
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  movement_type: 'in' | 'out'
  quantity: number
  reason: string | null
  created_at: string
}
