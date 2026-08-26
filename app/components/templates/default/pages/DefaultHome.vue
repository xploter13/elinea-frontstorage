<script setup lang="ts">
import { ArrowRight, Clock3, PackageCheck, ShieldCheck, Sparkles } from '@lucide/vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import DefaultProductCard from '../components/DefaultProductCard.vue'
import DefaultSectionHeading from '../components/DefaultSectionHeading.vue'
import DefaultBundle from '../components/DefaultBundle.vue'
import DefaultManifesto from '../components/DefaultManifesto.vue'
import DefaultSocialGallery from '../components/DefaultSocialGallery.vue'
import DefaultTestimonials from '../components/DefaultTestimonials.vue'
const props = defineProps<{ storefront: StorefrontPayload }>()
const { productImage, usePlaceholder, activeCategories } = useDefaultCatalog(props.storefront)
const featured = computed(() => (props.storefront.products.filter(product => product.is_featured).length ? props.storefront.products.filter(product => product.is_featured) : props.storefront.products).slice(0, 8))
const heroProduct = computed(() => featured.value.find(product => productImage(product)) || featured.value[0])
const theme = computed(() => props.storefront.site.theme)
const heroTitle = computed(() => theme.value?.hero_title || 'Sua rotina pede coisa boa.')
const heroSubtitle = computed(() => theme.value?.hero_subtitle || 'Produtos selecionados, compra simples e tudo o que faz sentido para o seu dia.')
const heroImage = computed(() => theme.value?.hero_image_url || (heroProduct.value ? productImage(heroProduct.value) : null))
const featuredTitle = computed(() => theme.value?.featured_title || 'Vale colocar na cesta.')
const showNewsletter = computed(() => theme.value?.show_newsletter !== false)
</script>

<template>
  <main>
    <section class="mx-auto grid max-w-[1440px] gap-5 px-4 pb-14 pt-5 sm:px-7 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-20">
      <div class="flex min-h-[520px] flex-col items-start justify-center rounded-[28px] bg-market-citrus p-7 sm:p-12 lg:min-h-[650px] lg:p-14"><div class="mb-auto flex items-center gap-2 text-[11px] font-black uppercase tracking-[.14em] text-market-ink/65"><Sparkles :size="15"/>Escolhas para hoje</div><h1 class="max-w-2xl text-[clamp(3.8rem,7vw,7.5rem)] font-black leading-[.82] tracking-[-.08em] text-market-ink">{{ heroTitle }}</h1><p class="mt-7 max-w-md text-base leading-7 text-market-ink/70">{{ heroSubtitle }}</p><NuxtLink to="/produtos" class="group mt-8 flex items-center gap-3 rounded-full bg-market-ink px-6 py-4 text-sm font-black text-white no-underline transition hover:bg-market-leaf">Ver produtos<ArrowRight :size="18" class="transition-transform group-hover:translate-x-1"/></NuxtLink></div>
      <div class="relative min-h-[520px] overflow-hidden rounded-[28px] bg-[#dfe5da] lg:min-h-[650px]"><img v-if="heroImage" :src="heroImage" :alt="heroProduct?.name || storefront.site.name" class="size-full object-cover" fetchpriority="high" @error="usePlaceholder"><img v-else src="/images/placeholders/product-default.png" alt="Seleção de produtos da loja" class="size-full object-cover" fetchpriority="high"><div v-if="heroProduct" class="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-white/90 p-5 backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6 sm:min-w-[360px]"><div><span class="text-[10px] font-black uppercase tracking-[.14em] text-market-leaf">Destaque da loja</span><strong class="mt-1 block text-lg text-market-ink">{{ heroProduct.name }}</strong></div><NuxtLink :to="`/produto/${heroProduct.slug}`" class="grid size-11 shrink-0 place-items-center rounded-full bg-market-ink text-white"><ArrowRight :size="18"/></NuxtLink></div></div>
    </section>
    <section class="border-y border-market-line bg-white"><div class="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-market-line px-4 sm:px-7 lg:grid-cols-4 lg:divide-y-0 lg:px-10"><div class="benefit"><ShieldCheck/><span><strong>Compra segura</strong><small>Seus dados protegidos</small></span></div><div class="benefit"><PackageCheck/><span><strong>Entrega confiável</strong><small>Acompanhe seu pedido</small></span></div><div class="benefit"><Clock3/><span><strong>Compra rápida</strong><small>Sem perder seu tempo</small></span></div><div class="benefit"><Sparkles/><span><strong>Seleção especial</strong><small>Produtos escolhidos</small></span></div></div></section>
    <section v-if="activeCategories.length" class="mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10 lg:py-28"><DefaultSectionHeading eyebrow="Encontre mais rápido" title="Tudo no lugar certo." to="/categorias" link-label="Ver categorias"/><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><NuxtLink v-for="(category,index) in activeCategories.slice(0,8)" :key="category.id" :to="`/categoria/${category.slug}`" class="group flex min-h-44 flex-col justify-between rounded-[20px] border border-market-line bg-white p-6 text-market-ink no-underline transition hover:-translate-y-1 hover:border-market-leaf"><span class="text-xs font-black text-market-leaf">{{ String(index+1).padStart(2,'0') }}</span><div><h3 class="text-2xl font-black tracking-[-.04em]">{{ category.name }}</h3><ArrowRight :size="18" class="mt-3 transition-transform group-hover:translate-x-1"/></div></NuxtLink></div></section>
    <section class="mx-auto max-w-[1440px] px-4 pb-20 sm:px-7 lg:px-10 lg:pb-28"><DefaultSectionHeading eyebrow="Nossa seleção" :title="featuredTitle" description="Destaques escolhidos para facilitar sua próxima compra." to="/produtos" link-label="Explorar tudo"/><div v-if="featured.length" class="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5"><DefaultProductCard v-for="product in featured" :key="product.id" :product="product"/></div><div v-else class="rounded-[24px] border border-dashed border-market-leaf/40 p-16 text-center text-market-ink/60">A vitrine está sendo preparada.</div></section>
    <DefaultManifesto />
    <DefaultBundle :products="featured" :storefront="storefront" />
    <DefaultTestimonials />
    <DefaultSocialGallery />
    <section v-if="showNewsletter" class="mx-auto max-w-[1360px] px-4 sm:px-7"><div class="grid overflow-hidden rounded-[28px] bg-market-leaf text-white lg:grid-cols-[1.2fr_.8fr]"><div class="p-8 sm:p-12 lg:p-16"><span class="text-[11px] font-black uppercase tracking-[.15em] text-market-citrus">Novidades da loja</span><h2 class="mt-4 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Receba boas escolhas, não mais e-mails.</h2><p class="mt-5 max-w-lg text-sm leading-6 text-white/65">Ofertas relevantes e novidades da loja, enviadas com moderação.</p></div><form class="flex items-end gap-2 p-8 lg:p-16" @submit.prevent><label class="sr-only" for="newsletter-email">Seu e-mail</label><input id="newsletter-email" type="email" class="min-w-0 flex-1 border-b border-white/40 bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/45" placeholder="seu@email.com"><button type="submit" class="grid size-12 shrink-0 place-items-center rounded-full bg-market-citrus text-market-ink" aria-label="Cadastrar e-mail"><ArrowRight :size="19"/></button></form></div></section>
  </main>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.benefit{@apply flex items-center gap-3 px-3 py-5 text-market-ink sm:px-5 lg:justify-center}.benefit>svg{@apply size-5 shrink-0 text-market-leaf}.benefit span{@apply grid}.benefit strong{@apply text-xs font-black}.benefit small{@apply mt-0.5 text-[10px] text-market-ink/50}
</style>
