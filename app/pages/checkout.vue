<script setup lang="ts">
import SharedCheckout from '~~/layers/storefront-core/app/components/SharedCheckout.vue'
import type { StorefrontPage } from '~/utils/storefront-page'
const page = { kind: 'checkout' } satisfies StorefrontPage
const storefront = await useStorefrontPage(page)
</script>

<template><SharedCheckout :storefront="storefront" :page="page" /></template>
