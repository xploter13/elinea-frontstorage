<script setup lang="ts">
import SharedCustomerArea from '~/components/SharedCustomerArea.vue'

const storefront = await useStorefrontPage({ kind: 'account', section: 'profile' })
</script>

<template><SharedCustomerArea :storefront="storefront" section="profile" /></template>
