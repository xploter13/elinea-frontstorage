<script setup lang="ts">import { BadgeCheck, Star } from '@lucide/vue'
const testimonials = [
  { name: 'Juliana', text: 'A compra foi simples e os produtos chegaram do jeito que eu esperava. Já virou parte da minha rotina.' },
  { name: 'Ricardo', text: 'Encontrei tudo rápido, com informações claras e uma experiência muito tranquila do começo ao fim.' },
  { name: 'Camila', text: 'Boa seleção, entrega cuidadosa e uma loja que realmente facilita as escolhas do dia a dia.' },
]
</script>
<template>
  <section class="bg-white px-4 py-24 sm:px-7 lg:px-10 lg:py-32"><div class="mx-auto max-w-[1440px]"><div class="mx-auto max-w-3xl text-center"><p class="text-[11px] font-black uppercase tracking-[.16em] text-market-leaf">Experiências reais</p><h2 class="mt-4 text-5xl font-black leading-[.92] tracking-[-.06em] text-market-ink sm:text-6xl">Quem compra, recomenda.</h2><p class="mt-5 text-sm text-market-ink/50">Histórias de quem escolheu praticidade e encontrou confiança.</p></div><div class="mt-14 grid gap-4 lg:grid-cols-3"><article v-for="(item,index) in testimonials" :key="item.name" class="grid min-h-[330px] overflow-hidden rounded-[22px] border border-market-line bg-market-mist" :class="index === 1 ? 'sm:grid-cols-[1fr_.8fr] lg:grid-cols-1' : 'sm:grid-cols-[.8fr_1fr] lg:grid-cols-1'"><img src="/images/placeholders/customer.png" :alt="`Cliente ${item.name}`" class="h-56 w-full object-cover lg:h-52" :class="index === 1 ? 'sm:order-2 lg:order-none' : ''"><div class="flex flex-col p-6"><div class="flex gap-1 text-market-leaf"><Star v-for="star in 5" :key="star" :size="14" fill="currentColor"/></div><p class="mt-5 text-sm leading-6 text-market-ink/70">“{{ item.text }}”</p><div class="mt-auto pt-7"><strong class="block text-base text-market-ink">{{ item.name }}</strong><span class="mt-1 flex items-center gap-1.5 text-xs text-market-ink/45"><BadgeCheck :size="15" class="text-market-leaf"/>Compra verificada</span></div></div></article></div></div></section>
</template>
