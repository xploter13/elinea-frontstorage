<script setup lang="ts">
import { Heart, ShoppingBag } from '@lucide/vue'
import type { StoreProduct } from '#shared/types/storefront'
import { useStorefrontCatalog } from '~~/layers/storefront-core/app/composables/useStorefrontCatalog'
const props = defineProps<{ product: StoreProduct }>()
const { money, productImage, usePlaceholder, discount } = useStorefrontCatalog()
</script>

<template>
  <article class="group min-w-0">
    <div class="relative overflow-hidden rounded-[22px] bg-[#e7eadf]">
      <NuxtLink :to="`/produto/${product.slug}`" class="block aspect-[4/5] overflow-hidden">
        <img v-if="productImage(product)" :src="productImage(product)!" :alt="product.name" class="size-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" @error="usePlaceholder">
        <img v-else src="/images/placeholders/product-default.png" alt="Imagem ilustrativa do produto" class="size-full object-cover" loading="lazy">
      </NuxtLink>
      <span v-if="discount(product)" class="absolute left-3 top-3 rounded-full bg-market-citrus px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-market-ink">-{{ discount(product) }}%</span>
      <button class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-market-ink opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus:opacity-100" type="button" aria-label="Adicionar aos favoritos"><Heart :size="17" :stroke-width="1.8"/></button>
      <button class="absolute bottom-3 right-3 grid size-11 translate-y-2 place-items-center rounded-full bg-market-ink text-white opacity-0 transition hover:bg-market-leaf group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" type="button" disabled aria-label="Adicionar ao carrinho"><ShoppingBag :size="18"/></button>
    </div>
    <div class="flex items-start justify-between gap-4 pt-4"><div class="min-w-0"><p class="mb-1 text-[10px] font-bold uppercase tracking-[.12em] text-market-leaf">{{ product.categories?.[0]?.name || 'Seleção' }}</p><NuxtLink :to="`/produto/${product.slug}`" class="text-market-ink no-underline"><h3 class="truncate text-[15px] font-bold">{{ product.name }}</h3></NuxtLink></div><div class="grid shrink-0 justify-items-end"><s v-if="product.original_price && product.original_price > product.price" class="text-xs text-market-ink/45">{{ money(product.original_price) }}</s><strong class="text-sm text-market-ink">{{ money(product.price) }}</strong></div></div>
  </article>
</template>
