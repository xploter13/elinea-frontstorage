<script setup lang="ts">import { Headphones, PackageCheck, RotateCcw, ShieldCheck } from '@lucide/vue'
const images = ['/images/placeholders/grocery-tote.png','/images/placeholders/pantry-dark.png','/images/placeholders/product-default.png','/images/placeholders/customer.png','/images/placeholders/grocery-tote.png','/images/placeholders/pantry-dark.png']
const benefits = [
  { icon: PackageCheck, title: 'Entrega confiável', text: 'Acompanhe seu pedido até chegar.' },
  { icon: RotateCcw, title: 'Troca descomplicada', text: 'Uma experiência clara também depois da compra.' },
  { icon: Headphones, title: 'Atendimento que ajuda', text: 'Suporte para resolver suas dúvidas.' },
  { icon: ShieldCheck, title: 'Checkout protegido', text: 'Seus dados seguros em cada etapa.' },
]
</script>
<template>
  <section class="bg-white px-4 pb-12 pt-24 sm:px-7 lg:px-10 lg:pt-32"><div class="mx-auto max-w-[1440px]"><div class="mx-auto max-w-3xl text-center"><h2 class="text-5xl font-black leading-[.92] tracking-[-.06em] text-market-ink sm:text-6xl">Da loja para o seu dia.</h2><p class="mt-5 text-sm text-market-ink/50">Produtos selecionados para combinar com a sua rotina.</p></div><div class="mt-12 grid grid-cols-3 gap-2 lg:grid-cols-6"><img v-for="(src,index) in images" :key="index" :src="src" alt="Inspiração de produtos para o cotidiano" class="aspect-square size-full rounded-[16px] object-cover"></div><div class="mt-16 grid gap-y-10 border-t border-market-line pt-12 sm:grid-cols-2 lg:grid-cols-4"><div v-for="item in benefits" :key="item.title" class="px-4 text-center lg:border-r lg:border-market-line lg:last:border-0"><component :is="item.icon" :size="30" :stroke-width="1.6" class="mx-auto text-market-leaf"/><h3 class="mt-5 text-sm font-black text-market-ink">{{ item.title }}</h3><p class="mx-auto mt-2 max-w-[220px] text-xs leading-5 text-market-ink/45">{{ item.text }}</p></div></div></div></section>
</template>
