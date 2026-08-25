<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
defineProps<{ eyebrow?: string, title: string, description?: string, to?: string, linkLabel?: string }>()
</script>
<template><div class="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end"><div><p v-if="eyebrow" class="mb-3 text-[11px] font-black uppercase tracking-[.16em] text-market-leaf">{{ eyebrow }}</p><h2 class="max-w-3xl text-4xl font-black leading-[.95] tracking-[-.055em] text-market-ink sm:text-5xl">{{ title }}</h2><p v-if="description" class="mt-4 max-w-xl text-sm leading-6 text-market-ink/60">{{ description }}</p></div><NuxtLink v-if="to" :to="to" class="group flex shrink-0 items-center gap-2 border-b border-market-ink pb-1 text-sm font-black text-market-ink no-underline">{{ linkLabel }}<ArrowRight :size="16" class="transition-transform group-hover:translate-x-1"/></NuxtLink></div></template>
