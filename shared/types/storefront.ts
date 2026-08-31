export interface ApiEnvelope<T> { data: T }

export interface StoreTemplate {
  id: number
  name: string
  slug: string
  folder: string
  segment: string
  preview_image: string | null
}

export interface StoreTheme {
  logo_path: string | null
  favicon_path: string | null
  hero_image_path: string | null
  logo_url: string | null
  favicon_url: string | null
  hero_image_url: string | null
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  font_family: string | null
  hero_title: string | null
  hero_subtitle: string | null
  featured_title: string | null
  show_newsletter: boolean
  header_message: string | null
  contact_phone: string | null
  service_hours: string | null
  hero_eyebrow: string | null
  hero_cta_label: string | null
  categories_title: string | null
  promo_primary_title: string | null
  promo_primary_text: string | null
  promo_secondary_title: string | null
  promo_secondary_text: string | null
  promo_tertiary_title: string | null
  promo_tertiary_text: string | null
  offers_callout_title: string | null
  offers_callout_text: string | null
  popular_title: string | null
  newsletter_eyebrow: string | null
  newsletter_title: string | null
  newsletter_text: string | null
  newsletter_button_label: string | null
  footer_tagline: string | null
  footer_description: string | null
}

export interface StoreSite {
  id: number
  name: string
  slug: string
  domain: string | null
  segment: string
  plan_id: number | null
  status: string
  billing_status: string | null
  billing_ends_at: string | null
  trial_ends_at: string | null
  template: StoreTemplate | null
  theme: StoreTheme | null
}

export interface StoreCategory {
  id: number
  parent_id: number | null
  name: string
  slug: string
  description: string | null
  priority: number
  is_active: boolean
}

export interface ProductVariation {
  name: string
  sku: string
  price: number | null
  original_price: number | null
  stock: number
  image_path: string | null
  attributes: Record<string, string>
}

export interface StoreProduct {
  id: number
  name: string
  slug: string
  sku: string
  price: number
  original_price: number | null
  stock: number
  variations: ProductVariation[]
  state: string | null
  is_featured: boolean
  description: string | null
  excerpt: string | null
  image_path: string | null
  image_url?: string | null
  meta_description: string | null
  brand_id: number | null
  categories: StoreCategory[]
}

export interface AnalyticsConfiguration {
  enabled: boolean
  google_analytics_4: { enabled: boolean, measurement_id: string | null }
  facebook_pixel: { enabled: boolean, pixel_id: string | null }
}

export interface StorefrontPayload {
  site: StoreSite
  products: StoreProduct[]
  categories: StoreCategory[]
  analytics: AnalyticsConfiguration | null
  newsletter: { enabled: boolean } | null
  resolvedSite: string
  warnings: string[]
}
