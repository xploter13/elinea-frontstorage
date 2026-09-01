<script setup lang="ts">
import { ArrowRight, Plus } from '@lucide/vue'
import type { StoreProduct, StorefrontPayload } from '#shared/types/storefront'
import { useStorefrontCatalog } from '~~/layers/storefront-core/app/composables/useStorefrontCatalog'
const props = defineProps<{ products: StoreProduct[], storefront: StorefrontPayload }>()
const { money, productImage, usePlaceholder } = useStorefrontCatalog(props.storefront)
</script>
<template>
  <section class="mx-auto max-w-[1440px] px-4 py-24 sm:px-7 lg:px-10 lg:py-32">
    <div class="grid items-stretch gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
      <div class="flex flex-col justify-center"><p class="text-[11px] font-black uppercase tracking-[.16em] text-market-leaf">Seleção da casa</p><h2 class="mt-4 text-5xl font-black leading-[.9] tracking-[-.06em] text-market-ink sm:text-6xl">Monte sua seleção.</h2><p class="mt-5 max-w-md text-sm leading-6 text-market-ink/55">Combine itens que fazem sentido juntos e imagine sua próxima compra.</p>
        <div class="mt-9 divide-y divide-market-line border-y border-market-line"><div v-for="product in products.slice(0,3)" :key="product.id" class="grid grid-cols-[72px_1fr_auto] items-center gap-4 py-4"><img :src="productImage(product) || '/images/placeholders/product-default.png'" :alt="product.name" class="size-[72px] rounded-xl object-cover" @error="usePlaceholder"><div><strong class="block text-sm text-market-ink">{{ product.name }}</strong><span class="mt-1 block text-sm font-black text-market-leaf">{{ money(product.price) }}</span></div><button type="button" class="grid size-10 place-items-center rounded-full bg-market-ink text-white" aria-label="Adicionar à seleção"><Plus :size="17"/></button></div></div>
        <button type="button" class="mt-6 flex h-14 items-center justify-between rounded-full bg-market-leaf px-6 text-sm font-black text-white"><span>Adicionar seleção ao carrinho</span><span class="grid size-9 place-items-center rounded-full bg-market-citrus text-market-ink"><ArrowRight :size="17"/></span></button>
      </div>
      <div class="min-h-[580px] overflow-hidden rounded-[28px]"><img src="/images/placeholders/grocery-tote.png" alt="Sacola com uma seleção de produtos" class="size-full object-cover"></div>
    </div>
  </section>
</template>
