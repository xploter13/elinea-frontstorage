import type { StorefrontPayload } from '#shared/types/storefront'

export type StorefrontPage =
  | { kind: 'home' }
  | { kind: 'products' }
  | { kind: 'categories' }
  | { kind: 'category', slug: string }
  | { kind: 'product', slug: string }
  | { kind: 'cart' }
  | { kind: 'not-found' }

export function resolveStorefrontPage(path: string): StorefrontPage {
  const segments = path.split('/').filter(Boolean)
  if (!segments.length) return { kind: 'home' }
  if (segments.length === 1 && segments[0] === 'produtos') return { kind: 'products' }
  if (segments.length === 1 && segments[0] === 'categorias') return { kind: 'categories' }
  if (segments.length === 1 && segments[0] === 'carrinho') return { kind: 'cart' }
  if (segments.length === 2 && segments[0] === 'produto' && segments[1]) return { kind: 'product', slug: segments[1] }
  if (segments.length === 2 && segments[0] === 'categoria' && segments[1]) return { kind: 'category', slug: segments[1] }
  return { kind: 'not-found' }
}

export function pageTitle(page: StorefrontPage, storefront: StorefrontPayload): string {
  if (page.kind === 'product') return storefront.products.find(product => product.slug === page.slug)?.name || 'Produto não encontrado'
  if (page.kind === 'category') return storefront.categories.find(category => category.slug === page.slug)?.name || 'Categoria não encontrada'
  if (page.kind === 'products') return 'Produtos'
  if (page.kind === 'categories') return 'Categorias'
  if (page.kind === 'cart') return 'Carrinho'
  return storefront.site.name
}
