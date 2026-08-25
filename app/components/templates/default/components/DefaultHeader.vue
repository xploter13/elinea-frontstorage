<script setup lang="ts">
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from '@lucide/vue'

defineProps<{ storeName: string }>()
const menuOpen = ref(false)
const searchOpen = ref(false)
</script>

<template>
  <div class="sticky top-0 z-50 border-b border-market-line bg-market-mist/95 backdrop-blur-xl">
    <div class="bg-market-ink px-4 py-2 text-center text-[11px] font-bold tracking-[.08em] text-white sm:text-xs">Frete calculado no carrinho · Compra protegida</div>
    <header class="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-5 px-4 sm:px-7 lg:px-10">
      <button class="grid size-10 place-items-center rounded-full border border-market-line lg:hidden" type="button" :aria-expanded="menuOpen" aria-label="Abrir menu" @click="menuOpen = !menuOpen"><X v-if="menuOpen" :size="20"/><Menu v-else :size="20"/></button>
      <NuxtLink to="/" class="text-xl font-black tracking-[-.06em] text-market-ink no-underline sm:text-2xl">{{ storeName }}</NuxtLink>
      <nav class="hidden items-center justify-center gap-8 lg:flex" aria-label="Navegação principal">
        <NuxtLink to="/" class="nav-link">Início</NuxtLink><NuxtLink to="/produtos" class="nav-link">Produtos</NuxtLink><NuxtLink to="/categorias" class="nav-link">Categorias</NuxtLink>
      </nav>
      <div class="flex justify-end gap-1 text-market-ink">
        <button class="icon-button hidden sm:grid" type="button" aria-label="Buscar" @click="searchOpen = !searchOpen"><Search :size="20" :stroke-width="1.8"/></button>
        <button class="icon-button hidden sm:grid" type="button" aria-label="Minha conta"><UserRound :size="20" :stroke-width="1.8"/></button>
        <button class="icon-button hidden md:grid" type="button" aria-label="Favoritos"><Heart :size="20" :stroke-width="1.8"/></button>
        <NuxtLink class="icon-button relative" to="/carrinho" aria-label="Carrinho"><ShoppingBag :size="20" :stroke-width="1.8"/><span class="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-market-citrus text-[9px] font-black">0</span></NuxtLink>
      </div>
    </header>
    <Transition name="drop"><form v-if="searchOpen" class="mx-auto flex max-w-[900px] gap-3 border-t border-market-line px-4 py-4" @submit.prevent><Search :size="20"/><label class="sr-only" for="store-search">Buscar produtos</label><input id="store-search" class="min-w-0 flex-1 bg-transparent text-base outline-none" placeholder="O que você procura?" autofocus><button class="text-sm font-bold" type="submit">Buscar</button></form></Transition>
    <Transition name="drop"><nav v-if="menuOpen" class="grid border-t border-market-line bg-market-mist px-4 py-5 lg:hidden" aria-label="Navegação móvel"><NuxtLink to="/" class="mobile-link">Início</NuxtLink><NuxtLink to="/produtos" class="mobile-link">Produtos</NuxtLink><NuxtLink to="/categorias" class="mobile-link">Categorias</NuxtLink></nav></Transition>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.nav-link{@apply relative py-2 text-sm font-bold text-market-ink no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-market-ink after:transition-transform hover:after:origin-left hover:after:scale-x-100}.icon-button{@apply size-10 place-items-center rounded-full text-market-ink transition-colors hover:bg-white}.mobile-link{@apply border-b border-market-line py-4 text-2xl font-black tracking-[-.04em] text-market-ink no-underline}.drop-enter-active,.drop-leave-active{transition:opacity .2s,transform .2s}.drop-enter-from,.drop-leave-to{opacity:0;transform:translateY(-8px)}
</style>
