import type { AnalyticsConfiguration, StoreCategory, StoreProduct, StoreSite, StorefrontPayload } from '#shared/types/storefront'

function resolveSite(event: Parameters<typeof getRequestHost>[0], fallback: string): string {
  const explicitSite = getRequestHeader(event, 'x-site')?.trim()
  if (explicitSite) return explicitSite
  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  const host = (forwardedHost || getRequestHost(event)).split(':')[0]?.toLowerCase()
  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1') return fallback
  return host
}

function warningFor(resource: string, reason: unknown): string {
  const status = reason && typeof reason === 'object' && 'statusCode' in reason ? String(reason.statusCode) : 'indisponível'
  return `${resource}: ${status}`
}

function normalizeProducts(products: StoreProduct[]): StoreProduct[] {
  return products.map(product => ({
    ...product,
    variations: Array.isArray(product.variations) ? product.variations : [],
    categories: Array.isArray(product.categories) ? product.categories : [],
  }))
}

export default defineEventHandler(async (event): Promise<StorefrontPayload> => {
  const config = useRuntimeConfig(event)
  const resolvedSite = resolveSite(event, config.storefrontSite)
  const options = { apiBase: config.apiBase.replace(/\/$/, ''), site: resolvedSite }
  let site: StoreSite

  try {
    site = await fetchStorefrontResource<StoreSite>('/site', options)
  } catch (error) {
    const upstreamStatus = error && typeof error === 'object' && 'statusCode' in error ? Number(error.statusCode) : 502
    const notFound = upstreamStatus === 404
    throw createError({
      statusCode: notFound ? 404 : 502,
      statusMessage: notFound ? 'Loja não encontrada' : 'API da loja indisponível',
      message: notFound ? `Nenhuma loja foi encontrada para ${resolvedSite}.` : 'Não foi possível consultar a API da Elinea.',
    })
  }

  const [productsResult, categoriesResult, analyticsResult, newsletterResult] = await Promise.allSettled([
    fetchStorefrontResource<StoreProduct[]>('/products', options),
    fetchStorefrontResource<StoreCategory[]>('/categories', options),
    fetchStorefrontResource<AnalyticsConfiguration>('/integrations/analytics', options),
    fetchStorefrontResource<{ enabled: boolean }>('/newsletter-popup', options),
  ])
  const warnings: string[] = []
  if (productsResult.status === 'rejected') warnings.push(warningFor('products', productsResult.reason))
  if (categoriesResult.status === 'rejected') warnings.push(warningFor('categories', categoriesResult.reason))
  if (analyticsResult.status === 'rejected') warnings.push(warningFor('analytics', analyticsResult.reason))
  if (newsletterResult.status === 'rejected') warnings.push(warningFor('newsletter', newsletterResult.reason))

  return {
    site,
    products: productsResult.status === 'fulfilled' ? normalizeProducts(productsResult.value) : [],
    categories: categoriesResult.status === 'fulfilled' ? categoriesResult.value : [],
    analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
    newsletter: newsletterResult.status === 'fulfilled' ? newsletterResult.value : null,
    resolvedSite,
    warnings,
  }
})
