<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
import type { StorefrontPage } from '~/utils/storefront-page'
import PharmacyFooter from './components/PharmacyRetailFooter.vue'
import PharmacyHeader from './components/PharmacyRetailHeader.vue'
import PharmacyCommerceOverlay from './components/PharmacyCommerceOverlay.vue'
import PharmacyCart from './pages/PharmacyCart.vue'
import PharmacyCategories from './pages/PharmacyCategories.vue'
import PharmacyHome from './pages/PharmacyRetailHome.vue'
import PharmacyProductDetail from './pages/PharmacyProductDetail.vue'
import PharmacyProducts from './pages/PharmacyProducts.vue'

const props = defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
const product = computed(() => {
  const page = props.page
  return page.kind === 'product' ? props.storefront.products.find(item => item.slug === page.slug) : undefined
})
const category = computed(() => {
  const page = props.page
  return page.kind === 'category' ? props.storefront.categories.find(item => item.slug === page.slug) : undefined
})
const categoryProducts = computed(() => category.value ? props.storefront.products.filter(item => item.categories.some(value => value.id === category.value?.id)) : [])
const theme = computed(() => props.storefront.site.theme)
const themeStyle = computed(() => ({
  '--ph-primary': theme.value?.primary_color || '#177c68',
  '--ph-ink': theme.value?.secondary_color || '#153b36',
  '--ph-accent': theme.value?.accent_color || '#ff6b5f',
  '--ph-body': `"${theme.value?.font_family || 'Georgia'}", Georgia, Cambria, "Times New Roman", serif`,
  '--color-primary': theme.value?.primary_color || '#177c68',
  '--color-primary-content': '#ffffff',
  '--color-secondary': theme.value?.accent_color || '#ff6b5f',
  '--color-secondary-content': '#ffffff',
  '--color-base-100': '#ffffff',
  '--color-base-200': '#f3f7f5',
  '--color-base-300': '#dfe8e5',
  '--color-base-content': theme.value?.secondary_color || '#153b36',
  '--radius-box': '0.75rem',
  '--radius-field': '0.5rem',
}))
</script>

<template>
  <div class="pharmacy-shell" data-theme="light" :style="themeStyle">
    <PharmacyHeader :storefront="storefront" :store-name="storefront.site.name" :logo-url="theme?.logo_url" :categories="storefront.categories" :theme="theme" />
    <PharmacyHome v-if="page.kind === 'home'" :storefront="storefront" />
    <PharmacyProducts v-else-if="page.kind === 'products'" :storefront="storefront" :products="storefront.products" />
    <PharmacyCategories v-else-if="page.kind === 'categories'" :categories="storefront.categories" />
    <PharmacyProducts v-else-if="page.kind === 'category' && category" :storefront="storefront" :products="categoryProducts" :title="category.name" :description="category.description || undefined" />
    <PharmacyProductDetail v-else-if="page.kind === 'product' && product" :product="product" :storefront="storefront" />
    <PharmacyCart v-else-if="page.kind === 'cart'" :storefront="storefront" />
    <PharmacyFooter :store-name="storefront.site.name" :theme="theme" />
    <PharmacyCommerceOverlay :storefront="storefront" />
  </div>
</template>

<style scoped>
:global(*){box-sizing:border-box}
:global(body){margin:0}
.pharmacy-shell{
  min-height:100dvh;
  background:#f8faf7;
  color:var(--ph-ink);
  font-family:var(--ph-body);
  font-size:16px;
}
:global(.pharmacy-shell button),
:global(.pharmacy-shell input),
:global(.pharmacy-shell select),
:global(.pharmacy-shell textarea){font-family:var(--ph-body)}
:global(.pharmacy-shell h1),
:global(.pharmacy-shell h2),
:global(.pharmacy-shell h3),
:global(.pharmacy-shell h4),
:global(.pharmacy-shell .brand strong){font-family:var(--ph-body)!important}
:global(.pharmacy-shell p){font-size:max(0.9375rem,15px)}
:global(.pharmacy-shell .utility){font-size:12px}
:global(.pharmacy-shell .category-select),
:global(.pharmacy-shell .desktop-search input),
:global(.pharmacy-shell .mobile-search input){font-size:14px}
:global(.pharmacy-shell .location small){font-size:10px}
:global(.pharmacy-shell .location strong){font-size:12px}
:global(.pharmacy-shell .icon-action),
:global(.pharmacy-shell .cart){font-size:10px}
:global(.pharmacy-shell .category-nav a){font-size:13px}
:global(.pharmacy-shell .benefit-bar strong){font-size:13px}
:global(.pharmacy-shell .benefit-bar small){font-size:11px}
:global(.pharmacy-shell .hero-copy>span){font-size:13px}
:global(.pharmacy-shell .hero-copy p){font-size:17px}
:global(.pharmacy-shell .hero-trust){font-size:11px}
:global(.pharmacy-shell .section-title h2){font-size:28px}
:global(.pharmacy-shell .section-title>a){font-size:13px}
:global(.pharmacy-shell .category-rail strong){font-size:13px}
:global(.pharmacy-shell .category-rail small){font-size:11px}
:global(.pharmacy-shell .promo h2){font-size:23px}
:global(.pharmacy-shell .promo p){font-size:13px}
:global(.pharmacy-shell .promo a){font-size:12px}
:global(.pharmacy-shell .offers-heading nav button){font-size:13px}
:global(.pharmacy-shell .offers-layout>aside p){font-size:13px}
:global(.pharmacy-shell .offers-layout>aside a){font-size:12px}
:global(.pharmacy-shell .retail-product .category){font-size:11px}
:global(.pharmacy-shell .retail-product h3){font-size:16px}
:global(.pharmacy-shell .retail-product .product-content>p){font-size:12px}
:global(.pharmacy-shell .retail-product .product-price strong){font-size:20px}
:global(.pharmacy-shell .retail-product .product-price button){font-size:12px}
:global(.pharmacy-shell .compact-products small){font-size:10px}
:global(.pharmacy-shell .compact-products strong){font-size:13px}
:global(.pharmacy-shell .newsletter h2){font-size:34px}
:global(.pharmacy-shell .newsletter p){font-size:13px}
:global(.pharmacy-shell .footer-benefits strong){font-size:12px}
:global(.pharmacy-shell .footer-benefits small){font-size:10px}
:global(.pharmacy-shell .footer-main h3){font-size:14px}
:global(.pharmacy-shell .footer-main a),
:global(.pharmacy-shell .footer-main nav span){font-size:12px}
:global(.pharmacy-shell .footer-brand p){font-size:13px}
:global(.pharmacy-shell .footer-bottom){font-size:10px}
</style>
