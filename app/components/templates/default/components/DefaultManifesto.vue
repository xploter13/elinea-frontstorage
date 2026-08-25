<script setup lang="ts">import { ArrowRight } from '@lucide/vue'</script>
<template>
  <section class="relative min-h-[780px] overflow-hidden bg-market-ink px-5 py-24 text-white sm:min-h-[920px] lg:py-32">
    <div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
      <p class="text-[11px] font-black uppercase tracking-[.16em] text-market-citrus">Feito para a vida real</p>
      <h2 class="mt-5 text-5xl font-black leading-[.92] tracking-[-.06em] sm:text-7xl">Escolhas que acompanham sua rotina.</h2>
      <p class="mt-6 max-w-lg text-sm leading-6 text-white/60">Essenciais para simplificar o dia a dia e deixar mais tempo para o que importa.</p>
      <NuxtLink to="/produtos" class="group mt-8 flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-market-ink no-underline">Descobrir produtos<ArrowRight :size="17" class="transition-transform group-hover:translate-x-1"/></NuxtLink>
    </div>
    <img src="/images/placeholders/pantry-dark.png" alt="Seleção de produtos para despensa" class="absolute -left-16 top-8 h-64 w-52 rounded-[20px] object-cover opacity-90 sm:left-8 sm:h-80 sm:w-64 lg:left-[6vw]">
    <img src="/images/placeholders/grocery-tote.png" alt="Sacola com produtos essenciais" class="absolute -right-16 top-36 h-60 w-48 rounded-[20px] object-cover sm:right-8 sm:h-72 sm:w-56 lg:right-[8vw]">
    <img src="/images/placeholders/grocery-tote.png" alt="Produtos para o cotidiano" class="absolute -bottom-10 left-[10%] h-64 w-52 rounded-[20px] object-cover sm:bottom-12 sm:left-[18%] sm:h-72 sm:w-56">
    <img src="/images/placeholders/pantry-dark.png" alt="Itens selecionados para casa" class="absolute -bottom-14 right-[8%] h-72 w-56 rounded-[20px] object-cover sm:bottom-4 sm:right-[18%] sm:h-80 sm:w-64">
  </section>
</template>
