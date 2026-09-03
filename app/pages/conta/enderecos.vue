<script setup lang="ts">
import SharedCustomerArea from '~/components/SharedCustomerArea.vue'

const storefront = await useStorefrontPage({ kind: 'account', section: 'addresses' })

console.log(storefront);
</script>


<template><SharedCustomerArea :storefront="storefront" section="addresses" /></template>
