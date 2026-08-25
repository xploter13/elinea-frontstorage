<script setup lang="ts">
import type { Component } from 'vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import TemplateFallback from '~/components/templates/TemplateFallback.vue'

const requestHeaders = import.meta.server ? useRequestHeaders(['host', 'x-forwarded-host', 'x-site']) : undefined
const { data: storefront, error } = await useFetch<StorefrontPayload>('/api/storefront', { headers: requestHeaders, key: 'storefront' })

if (error.value || !storefront.value) {
  throw createError({
    statusCode: error.value?.statusCode || 502,
    statusMessage: error.value?.statusMessage || 'Storefront indisponível',
    message: error.value?.message || 'Não foi possível carregar a loja.',
  })
}

const templateRegistry: Record<string, Component> = {
  // 'folder-ou-slug': defineAsyncComponent(() => import('~/components/templates/MeuTemplate.vue')),
}
const templateKey = storefront.value.site.template?.folder || storefront.value.site.template?.slug || 'fallback'
const renderer = templateRegistry[templateKey] || TemplateFallback

useSeoMeta({ title: storefront.value.site.name, description: `Loja ${storefront.value.site.name}`, ogTitle: storefront.value.site.name })
</script>

<template>
  <component :is="renderer" :storefront="storefront" />
</template>
