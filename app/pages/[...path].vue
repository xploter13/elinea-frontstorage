<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
import BaseTemplate from '~/components/storefront/BaseTemplate.vue'
import SharedCheckout from '~~/layers/storefront-core/app/components/SharedCheckout.vue'
import SharedCustomerArea from '~~/layers/storefront-core/app/components/SharedCustomerArea.vue'
import { pageTitle, resolveStorefrontPage } from '~/utils/storefront-page'

const requestHeaders = import.meta.server ? useRequestHeaders(['host', 'x-forwarded-host']) : undefined
const { data: storefront, error } = await useFetch<StorefrontPayload>('/api/storefront', { headers: requestHeaders, key: 'storefront' })

if (error.value || !storefront.value) {
  throw createError({
    statusCode: error.value?.statusCode || 502,
    statusMessage: error.value?.statusMessage || 'Storefront indisponível',
    message: error.value?.message || 'Não foi possível carregar a loja.',
  })
}
const payload = storefront.value

const route = useRoute()
const page = computed(() => resolveStorefrontPage(route.path))
const renderer = computed(() => {
  if (page.value.kind === 'checkout') return SharedCheckout
  if (page.value.kind === 'account') return SharedCustomerArea
  return BaseTemplate
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
  <component :is="renderer" :storefront="payload" :page="page" />
</template>
