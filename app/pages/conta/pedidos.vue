<script setup lang="ts">
import SharedCustomerArea from '~~/layers/storefront-core/app/components/SharedCustomerArea.vue'
import type { StorefrontPage } from '~/utils/storefront-page'
const page = { kind: 'account', section: 'orders' } satisfies StorefrontPage
const storefront = await useStorefrontPage(page)
</script>

<template><SharedCustomerArea :storefront="storefront" :page="page" /></template>
