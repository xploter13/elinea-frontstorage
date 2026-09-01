<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
import type { StorefrontPage } from '~/utils/storefront-page'
import TemplateEditorial from '../TemplateEditorial.vue'
import TemplateEditorialInternal from '../TemplateEditorialInternal.vue'

defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
</script>

<template>
  <TemplateEditorial v-if="page.kind === 'home'" :storefront="storefront" />
  <TemplateEditorialInternal v-else :storefront="storefront" :page="page" />
</template>
