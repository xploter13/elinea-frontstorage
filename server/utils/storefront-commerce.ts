import type { H3Event } from 'h3'

function resolveCommerceSite(event: H3Event, fallback: string): string {
  const explicitSite = getRequestHeader(event, 'x-site')?.trim()
  if (explicitSite) return explicitSite

  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  const host = (forwardedHost || getRequestHost(event)).split(':')[0]?.toLowerCase()

  if (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1') return fallback
  return host
}

export async function proxyStorefrontCommerce<T>(event: H3Event, path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE'): Promise<T> {
  const config = useRuntimeConfig(event)
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Site': resolveCommerceSite(event, config.storefrontSite),
  }
  const cartSession = getRequestHeader(event, 'x-cart-session')?.trim()
  const authorization = getRequestHeader(event, 'authorization')?.trim()

  if (cartSession) headers['X-Cart-Session'] = cartSession
  if (authorization) headers.Authorization = authorization

  const body = method === 'POST' || method === 'PUT' ? await readBody(event) : undefined

  const response = await $fetch<unknown>(`${config.apiBase.replace(/\/$/, '')}${path}`, {
    method,
    headers,
    body,
    retry: 0,
  })

  return response as T
}
