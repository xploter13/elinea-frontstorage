<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
import type { StorefrontPage } from '~/utils/storefront-page'
import DefaultFooter from './components/DefaultFooter.vue'
import DefaultHeader from './components/DefaultHeader.vue'
import DefaultCart from './pages/DefaultCart.vue'
import DefaultCategories from './pages/DefaultCategories.vue'
import DefaultHome from './pages/DefaultHome.vue'
import DefaultProductDetail from './pages/DefaultProductDetail.vue'
import DefaultProducts from './pages/DefaultProducts.vue'
import { defaultBranding } from './default.config'

const props = defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
const product = computed(() => {
  const page = props.page
  return page.kind === 'product' ? props.storefront.products.find(item => item.slug === page.slug) : undefined
})
const category = computed(() => {
  const page = props.page
  return page.kind === 'category' ? props.storefront.categories.find(item => item.slug === page.slug) : undefined
})
const categoryProducts = computed(() => category.value ? props.storefront.products.filter(item => item.categories?.some(value => value.id === category.value?.id)) : [])
const theme = computed(() => defaultBranding)
const themeStyle = computed(() => {
  const values = theme.value

  return {
    '--color-market-ink': values?.primary_color || '#12372a',
    '--color-market-leaf': values?.secondary_color || '#1f6b4f',
    '--color-market-citrus': values?.accent_color || '#dff36a',
    '--font-sans': `${values?.font_family || 'Aptos'}, "Segoe UI", Arial, sans-serif`,
  }
})
</script>

<template><div class="min-h-dvh bg-market-mist font-sans text-market-ink" :style="themeStyle"><DefaultHeader :store-name="storefront.site.name" :logo-url="theme?.logo_url"/><DefaultHome v-if="page.kind === 'home'" :storefront="storefront"/><DefaultProducts v-else-if="page.kind === 'products'" :products="storefront.products"/><DefaultCategories v-else-if="page.kind === 'categories'" :categories="storefront.categories"/><DefaultProducts v-else-if="page.kind === 'category' && category" :products="categoryProducts" :title="category.name" :description="category.description || undefined"/><DefaultProductDetail v-else-if="page.kind === 'product' && product" :product="product" :storefront="storefront"/><DefaultCart v-else-if="page.kind === 'cart'"/><DefaultFooter :store-name="storefront.site.name"/></div></template>
