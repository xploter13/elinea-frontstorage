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
</script>

<template><div class="min-h-dvh bg-market-mist font-sans text-market-ink"><DefaultHeader :store-name="storefront.site.name"/><DefaultHome v-if="page.kind === 'home'" :storefront="storefront"/><DefaultProducts v-else-if="page.kind === 'products'" :products="storefront.products"/><DefaultCategories v-else-if="page.kind === 'categories'" :categories="storefront.categories"/><DefaultProducts v-else-if="page.kind === 'category' && category" :products="categoryProducts" :title="category.name" :description="category.description || undefined"/><DefaultProductDetail v-else-if="page.kind === 'product' && product" :product="product" :storefront="storefront"/><DefaultCart v-else-if="page.kind === 'cart'"/><DefaultFooter :store-name="storefront.site.name"/></div></template>
