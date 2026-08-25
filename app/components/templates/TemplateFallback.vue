<script setup lang="ts">
import type { StorefrontPayload } from '#shared/types/storefront'
defineProps<{ storefront: StorefrontPayload }>()
</script>

<template>
  <main class="fallback">
    <p class="eyebrow">Elinea storefront</p>
    <h1>{{ storefront.site.name }}</h1>
    <p>O template <strong>{{ storefront.site.template?.name || 'não definido' }}</strong> ainda não possui um renderer neste projeto.</p>
    <dl>
      <div><dt>Domínio resolvido</dt><dd>{{ storefront.resolvedSite }}</dd></div>
      <div><dt>Produtos recebidos</dt><dd>{{ storefront.products.length }}</dd></div>
      <div><dt>Categorias recebidas</dt><dd>{{ storefront.categories.length }}</dd></div>
    </dl>
  </main>
</template>

<style scoped>
.fallback { max-width: 760px; margin: 10vh auto; padding: 48px; font: 16px/1.6 system-ui, sans-serif; color: #17221b; }
.eyebrow { color: #68736b; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
h1 { margin: 8px 0; font-size: clamp(42px, 8vw, 76px); line-height: 1; }
dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-top: 40px; background: #dce2dd; }
dl div { padding: 20px; background: #f5f7f5; }
dt { color: #68736b; font-size: 12px; }
dd { margin: 5px 0 0; font-weight: 700; }
@media (max-width: 620px) { .fallback { padding: 24px; } dl { grid-template-columns: 1fr; } }
</style>
