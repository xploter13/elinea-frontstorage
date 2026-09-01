<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
import type { StorefrontPage } from '~/utils/storefront-page'
import BaseTemplate from '../base/BaseTemplate.vue'

defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
</script>

<template>
  <BaseTemplate :storefront="storefront" :page="page" />
</template>
