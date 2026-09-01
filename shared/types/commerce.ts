export interface StoreCartItem {
  id: number
  product_id: number
  name: string
  quantity: number
  unit_price: number
  total: number
}

export interface StoreCartTotals {
  items_count: number
  items_total: number
  discount: number
  shipping: number
  total: number
}

export interface StoreCart {
  id: number
  coupon_code: string | null
  items: StoreCartItem[]
  totals: StoreCartTotals
}
