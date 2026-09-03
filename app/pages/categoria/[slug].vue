<script setup lang="ts">
import BaseTemplate from '~/components/BaseTemplate.vue'
import type { StorefrontPage } from '~/utils/storefront-page'
const route = useRoute()
const page = { kind: 'category', slug: String(route.params.slug) } satisfies StorefrontPage
const storefront = await useStorefrontPage(page)
</script>

<template><BaseTemplate :storefront="storefront" :page="page" /></template>
