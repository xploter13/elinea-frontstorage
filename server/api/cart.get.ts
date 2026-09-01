import type { ApiEnvelope } from '#shared/types/storefront'
import type { StoreCart } from '#shared/types/commerce'

export default defineEventHandler(event => proxyStorefrontCommerce<ApiEnvelope<StoreCart>>(event, '/cart', 'GET'))
