import { AuthenticationError, createElineaClient, ElineaError, NotFoundError, ValidationError, type AnalyticsConfiguration, type Cart, type Category, type Product, type Store } from '@elinea/sdk'
import type { H3Event } from 'h3'
import type { StoreCart } from '#shared/types/commerce'
import type { StoreCategory, StoreProduct, StoreSite } from '#shared/types/storefront'

export function resolveStorefrontSite(event: H3Event, fallback: string): string {
  const explicitSite = getRequestHeader(event, 'x-site')?.trim()
  if (explicitSite) return explicitSite
  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  const host = (forwardedHost || getRequestHost(event)).split(':')[0]?.toLowerCase()
  return !host || ['localhost', '127.0.0.1', '::1'].includes(host) ? fallback : host
}

export function createServerElineaClient(event: H3Event) {
  const config = useRuntimeConfig(event)
  const hasStoreCredentials = Boolean(config.elineaStoreKey && config.elineaStoreSecret)
  const authorization = getRequestHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cartSession = getRequestHeader(event, 'x-cart-session')?.trim()

  return createElineaClient({
    baseUrl: config.apiBase,
    ...(hasStoreCredentials ? { storeKey: config.elineaStoreKey, storeSecret: config.elineaStoreSecret } : { site: resolveStorefrontSite(event, config.storefrontSite) }),
    getAccessToken: () => authorization,
    getCartSession: () => cartSession,
  })
}

export function rethrowElineaError(error: unknown): never {
  if (!(error instanceof ElineaError)) throw error
  const statusCode = error instanceof NotFoundError ? 404 : error instanceof ValidationError ? 422 : error instanceof AuthenticationError ? (error.status || 401) : (error.status || 502)
  throw createError({ statusCode, statusMessage: error.message, message: error.message, data: error.details })
}

export const toLegacyCategory = (category: Category): StoreCategory => ({ id: category.id, parent_id: category.parentId, name: category.name, slug: category.slug, description: category.description, priority: category.priority, is_active: category.isActive })
export const toLegacyProduct = (product: Product): StoreProduct => ({ id: product.id, name: product.name, slug: product.slug, sku: product.sku, price: product.price, original_price: product.originalPrice, stock: product.stock, variations: product.variations.map(variation => ({ name: variation.name, sku: variation.sku, price: variation.price, original_price: variation.originalPrice, stock: variation.stock, image_path: variation.imageUrl, attributes: variation.attributes })), state: product.state, is_featured: product.isFeatured, description: product.description, excerpt: product.excerpt, image_path: product.imageUrl, image_url: product.imageUrl, meta_description: product.metaDescription, brand_id: product.brandId, categories: product.categories.map(toLegacyCategory) })
export const toLegacyStore = (store: Store): StoreSite => ({ id: store.id, name: store.name, slug: store.slug, domain: store.domain, segment: store.segment, plan_id: store.planId, status: store.status, billing_status: store.billingStatus, billing_ends_at: store.billingEndsAt, trial_ends_at: store.trialEndsAt, template: store.template ? { id: store.template.id, name: store.template.name, slug: store.template.slug, folder: store.template.folder, segment: store.template.segment, preview_image: store.template.previewImage } : null })
export const toLegacyCart = (cart: Cart): StoreCart => ({ id: cart.id, coupon_code: cart.couponCode, items: cart.items.map(item => ({ id: item.id, product_id: item.productId, name: item.name, quantity: item.quantity, unit_price: item.unitPrice, total: item.total })), totals: { items_count: cart.totals.itemsCount, items_total: cart.totals.itemsTotal, discount: cart.totals.discount, shipping: cart.totals.shipping, total: cart.totals.total } })
export const toLegacyAnalytics = (analytics: AnalyticsConfiguration) => ({ enabled: analytics.enabled, google_analytics_4: { enabled: analytics.googleAnalytics4.enabled, measurement_id: analytics.googleAnalytics4.measurementId }, facebook_pixel: { enabled: analytics.facebookPixel.enabled, pixel_id: analytics.facebookPixel.pixelId } })

