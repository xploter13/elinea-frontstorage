import type { ApiEnvelope } from '#shared/types/storefront'
import type { StoreCart } from '#shared/types/commerce'

export default defineEventHandler((event) => {
  const product = getRouterParam(event, 'product')
  if (!product || !/^\d+$/.test(product)) throw createError({ statusCode: 400, statusMessage: 'Produto inválido' })
  return proxyStorefrontCommerce<ApiEnvelope<StoreCart>>(event, `/cart/items/${product}`, 'DELETE')
})
