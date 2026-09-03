import { AuthenticationError, createElineaClient, ElineaError, NotFoundError, ValidationError, type AnalyticsConfiguration, type Cart, type Category, type Product, type Store } from '@elinea/sdk'
import type { H3Event } from 'h3'
import type { StoreCart } from '#shared/types/commerce'
import type { StoreCategory, StoreProduct, StoreSite } from '#shared/types/storefront'

export function createServerElineaClient(event: H3Event) {
  const config = useRuntimeConfig(event)
  const storeKey = String(config.elineaStoreKey || '').trim()
  const storeSecret = String(config.elineaStoreSecret || '').trim()
  const hasStoreCredentials = Boolean(storeKey && storeSecret)

  if (Boolean(storeKey) !== Boolean(storeSecret)) {
    throw createError({ statusCode: 500, statusMessage: 'Credenciais incompletas', message: 'Configure a chave e o segredo da loja.' })
  }
  if (!hasStoreCredentials && !import.meta.dev) {
    throw createError({ statusCode: 500, statusMessage: 'Loja não configurada', message: 'Configure NUXT_ELINEA_STORE_KEY e NUXT_ELINEA_STORE_SECRET.' })
  }
  const authorization = getRequestHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '').trim() || getCookie(event, 'elinea_customer_token')
  const cartSession = getRequestHeader(event, 'x-cart-session')?.trim() || getCookie(event, 'elinea_cart_session')

  return createElineaClient({
    baseUrl: config.apiBase,
    ...(hasStoreCredentials ? { storeKey, storeSecret } : { site: config.elineaStoreSite }),
    getAccessToken: () => authorization,
    getCartSession: () => cartSession,
  })
}

export function rethrowElineaError(error: unknown): never {
  if (!(error instanceof ElineaError)) throw error
  const statusCode = error instanceof NotFoundError ? 404 : error instanceof ValidationError ? 422 : error instanceof AuthenticationError ? (error.status || 401) : (error.status || 502)
  throw createError({ statusCode, statusMessage: error.message, message: error.message, data: error.details })
}

export function persistCartSession(event: H3Event) {
  const session = getRequestHeader(event, 'x-cart-session')?.trim()
  if (session) setCookie(event, 'elinea_cart_session', session, { sameSite: 'lax', secure: !import.meta.dev, path: '/', maxAge: 60 * 60 * 24 * 30 })
}

export const toLegacyCategory = (category: Category): StoreCategory => ({ id: category.id, parent_id: category.parentId, name: category.name, slug: category.slug, description: category.description, priority: category.priority, is_active: category.isActive })
export const toLegacyProduct = (product: Product): StoreProduct => ({ id: product.id, name: product.name, slug: product.slug, sku: product.sku, price: product.price, original_price: product.originalPrice, stock: product.stock, variations: product.variations.map(variation => ({ name: variation.name, sku: variation.sku, price: variation.price, original_price: variation.originalPrice, stock: variation.stock, image_path: variation.imageUrl, attributes: variation.attributes })), state: product.state, is_featured: product.isFeatured, description: product.description, excerpt: product.excerpt, image_path: product.imageUrl, image_url: product.imageUrl, meta_description: product.metaDescription, brand_id: product.brandId, categories: product.categories.map(toLegacyCategory) })
export const toLegacyStore = (store: Store): StoreSite => ({ id: store.id, name: store.name, slug: store.slug, domain: store.domain, segment: store.segment, plan_id: store.planId, status: store.status, billing_status: store.billingStatus, billing_ends_at: store.billingEndsAt, trial_ends_at: store.trialEndsAt })
export const toLegacyCart = (cart: Cart): StoreCart => ({ id: cart.id, coupon_code: cart.couponCode, items: cart.items.map(item => ({ id: item.id, product_id: item.productId, name: item.name, quantity: item.quantity, unit_price: item.unitPrice, total: item.total })), totals: { items_count: cart.totals.itemsCount, items_total: cart.totals.itemsTotal, discount: cart.totals.discount, shipping: cart.totals.shipping, total: cart.totals.total } })
export const toLegacyAnalytics = (analytics: AnalyticsConfiguration) => ({ enabled: analytics.enabled, google_analytics_4: { enabled: analytics.googleAnalytics4.enabled, measurement_id: analytics.googleAnalytics4.measurementId }, facebook_pixel: { enabled: analytics.facebookPixel.enabled, pixel_id: analytics.facebookPixel.pixelId } })
