import type { ApiEnvelope } from '#shared/types/storefront'

interface StorefrontRequestOptions { apiBase: string, site: string }

export async function fetchStorefrontResource<T>(path: string, options: StorefrontRequestOptions): Promise<T> {
  const response = await $fetch<ApiEnvelope<T>>(`${options.apiBase}${path}`, {
    headers: { Accept: 'application/json', 'X-Site': options.site },
    retry: 0,
  })
  return response.data
}
