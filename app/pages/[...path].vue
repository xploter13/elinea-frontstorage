<script setup lang="ts">
import type { Component } from 'vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import TemplateFallback from '~/components/templates/TemplateFallback.vue'
import SharedCheckout from '~/components/shared/SharedCheckout.vue'
import SharedCustomerArea from '~/components/shared/SharedCustomerArea.vue'
import { pageTitle, resolveStorefrontPage } from '~/utils/storefront-page'

const requestHeaders = import.meta.server ? useRequestHeaders(['host', 'x-forwarded-host', 'x-site']) : undefined
const { data: storefront, error } = await useFetch<StorefrontPayload>('/api/storefront', { headers: requestHeaders, key: 'storefront' })

if (error.value || !storefront.value) {
  throw createError({
    statusCode: error.value?.statusCode || 502,
    statusMessage: error.value?.statusMessage || 'Storefront indisponível',
    message: error.value?.message || 'Não foi possível carregar a loja.',
  })
}
const payload = storefront.value

const homeRegistry: Record<string, Component> = {
  default: defineAsyncComponent(() => import('~/components/templates/default/DefaultTemplate.vue')),
  editorial: defineAsyncComponent(() => import('~/components/templates/TemplateEditorial.vue')),
  pharmacy: defineAsyncComponent(() => import('~/components/templates/pharmacy/PharmacyTemplate.vue')),
  farmacia: defineAsyncComponent(() => import('~/components/templates/pharmacy/PharmacyTemplate.vue')),
}
const internalRegistry: Record<string, Component> = {
  default: defineAsyncComponent(() => import('~/components/templates/default/DefaultTemplate.vue')),
  editorial: defineAsyncComponent(() => import('~/components/templates/TemplateEditorialInternal.vue')),
  pharmacy: defineAsyncComponent(() => import('~/components/templates/pharmacy/PharmacyTemplate.vue')),
  farmacia: defineAsyncComponent(() => import('~/components/templates/pharmacy/PharmacyTemplate.vue')),
}
const route = useRoute()
const page = computed(() => resolveStorefrontPage(route.path))
const templateKey = payload.site.template?.folder || payload.site.template?.slug || 'fallback'
const renderer = computed(() => {
  if (page.value.kind === 'checkout') return SharedCheckout
  if (page.value.kind === 'account') return SharedCustomerArea
  return page.value.kind === 'home' ? (homeRegistry[templateKey] || TemplateFallback) : (internalRegistry[templateKey] || TemplateFallback)
})

const requestedPage = page.value
if (requestedPage.kind === 'not-found'
  || (requestedPage.kind === 'product' && !payload.products.some(product => product.slug === requestedPage.slug))
  || (requestedPage.kind === 'category' && !payload.categories.some(category => category.slug === requestedPage.slug))) {
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada', message: 'O conteúdo solicitado não existe nesta loja.' })
}

useSeoMeta({
  title: () => `${pageTitle(page.value, payload)} | ${payload.site.name}`,
  description: () => `Conheça ${pageTitle(page.value, payload)} em ${payload.site.name}.`,
  ogTitle: () => `${pageTitle(page.value, payload)} | ${payload.site.name}`,
})
</script>

<template>
  <component :is="renderer" :storefront="storefront" :page="page" />
</template>
