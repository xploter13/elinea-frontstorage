<script setup lang="ts">
import { Camera, Mail, MapPin, ShieldCheck } from '@lucide/vue'
defineProps<{ storeName: string }>()
</script>

<template>
  <footer class="mt-24 bg-market-ink text-white">
    <div class="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10 lg:py-20">
      <div><strong class="text-3xl font-black tracking-[-.06em]">{{ storeName }}</strong><p class="mt-5 max-w-sm text-sm leading-6 text-white/65">Uma seleção feita para tornar suas compras mais simples, confiáveis e gostosas.</p><div class="mt-7 flex gap-2"><a class="social" href="#" aria-label="Fotos da loja"><Camera :size="18"/></a><a class="social" href="mailto:contato@loja.com" aria-label="E-mail"><Mail :size="18"/></a></div></div>
      <div><h2 class="footer-title">Navegue</h2><div class="footer-links"><NuxtLink to="/produtos">Todos os produtos</NuxtLink><NuxtLink to="/categorias">Categorias</NuxtLink><NuxtLink to="/carrinho">Meu carrinho</NuxtLink></div></div>
      <div><h2 class="footer-title">Compre tranquilo</h2><div class="space-y-4 text-sm text-white/65"><p class="flex gap-3"><ShieldCheck class="shrink-0 text-market-citrus" :size="19"/>Pagamento e dados protegidos</p><p class="flex gap-3"><MapPin class="shrink-0 text-market-citrus" :size="19"/>Entrega calculada para sua região</p></div></div>
    </div>
    <div class="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/15 px-5 py-6 text-xs text-white/45 sm:flex-row sm:justify-between sm:px-8 lg:px-10"><span>© {{ new Date().getFullYear() }} {{ storeName }}</span><span>Comércio digital por Elinea</span></div>
  </footer>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.social{@apply grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-market-citrus hover:text-market-citrus}.footer-title{@apply mb-5 text-xs font-black uppercase tracking-[.14em] text-market-citrus}.footer-links{@apply grid gap-3}.footer-links a{@apply text-sm text-white/65 no-underline transition-colors hover:text-white}
</style>
