<script setup lang="ts">
import { BadgePercent, PackageCheck, Search, SlidersHorizontal, Sparkles, X } from '@lucide/vue'
import type { StoreProduct, StorefrontPayload } from '#shared/types/storefront'
import BaseProductCard from '../components/BaseProductCard.vue'
const props = defineProps<{ products: StoreProduct[], storefront: StorefrontPayload, title?: string, description?: string }>()
const route = useRoute()
const router = useRouter()
const search = ref(String(route.query.busca || ''))
const selectedCategories = ref<number[]>([])
const inStockOnly = ref(false)
const onSaleOnly = ref(false)
const featuredOnly = ref(false)
const sort = ref<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance')
const filtersOpen = ref(false)
const categories = computed(() => {
  const map = new Map<number, StoreProduct['categories'][number]>()
  props.products.forEach(product => product.categories.forEach(category => map.set(category.id, category)))
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
})
const categoryCount = (categoryId: number) => props.products.filter(product => product.categories.some(category => category.id === categoryId)).length
const maxProductPrice = computed(() => Math.max(0, ...props.products.map(product => product.price)))
const priceLimit = ref(0)
const priceCeiling = computed(() => Math.max(1, Math.ceil(maxProductPrice.value)))
const activeFilterCount = computed(() => selectedCategories.value.length + Number(inStockOnly.value) + Number(onSaleOnly.value) + Number(featuredOnly.value) + Number(priceLimit.value > 0 && priceLimit.value < priceCeiling.value))
const displayPriceLimit = computed(() => priceLimit.value > 0 ? priceLimit.value : priceCeiling.value)
const filtered = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  const result = props.products.filter((item) => {
    const matchesTerm = !term || `${item.name} ${item.categories.map(category => category.name).join(' ')}`.toLocaleLowerCase('pt-BR').includes(term)
    const matchesCategory = !selectedCategories.value.length || item.categories.some(category => selectedCategories.value.includes(category.id))
    const matchesStock = !inStockOnly.value || item.stock > 0
    const matchesSale = !onSaleOnly.value || Boolean(item.original_price && item.original_price > item.price)
    const matchesFeatured = !featuredOnly.value || item.is_featured
    const matchesPrice = !priceLimit.value || item.price <= priceLimit.value
    return matchesTerm && matchesCategory && matchesStock && matchesSale && matchesFeatured && matchesPrice
  })
  return [...result].sort((a, b) => {
    if (sort.value === 'price-asc') return a.price - b.price
    if (sort.value === 'price-desc') return b.price - a.price
    if (sort.value === 'name') return a.name.localeCompare(b.name, 'pt-BR')
    return Number(b.is_featured) - Number(a.is_featured)
  })
})
const resetFilters = () => { selectedCategories.value = []; inStockOnly.value = false; onSaleOnly.value = false; featuredOnly.value = false; priceLimit.value = priceCeiling.value }
const syncSearch = () => router.replace({ query: { ...route.query, busca: search.value.trim() || undefined } })
watch(() => route.query.busca, value => { search.value = String(value || '') })
watch(priceCeiling, value => { priceLimit.value = value }, { immediate: true })
</script>

<template>
  <main class="catalog">
    <div class="catalog-heading"><span>Catálogo da farmácia</span><h1>{{ title || 'Tudo para cuidar de você.' }}</h1><p>{{ description || 'Encontre medicamentos, higiene, beleza e itens para o cuidado de toda a família.' }}</p></div>

    <div class="catalog-tools">
      <label class="search-field"><Search :size="18" /><span class="sr-only">Buscar nesta seleção</span><input v-model="search" placeholder="Buscar nesta seleção" @keyup.enter="syncSearch" @blur="syncSearch"></label>
      <div>
        <button class="mobile-filter" type="button" @click="filtersOpen = true"><SlidersHorizontal :size="16" />Filtros<span v-if="activeFilterCount">{{ activeFilterCount }}</span></button>
        <select v-model="sort" aria-label="Ordenar produtos"><option value="relevance">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A-Z</option></select>
      </div>
    </div>

    <div class="catalog-body">
      <aside class="filter-sidebar" :class="{ open: filtersOpen }" aria-label="Filtros do catálogo">
        <div class="filter-head">
          <div><span>filtros</span><strong>Refine sua compra</strong></div>
          <button type="button" aria-label="Fechar filtros" @click="filtersOpen = false"><X :size="18" /></button>
        </div>

        <section class="filter-block">
          <h2>Categorias</h2>
          <label v-for="category in categories" :key="category.id" class="check-row">
            <input v-model="selectedCategories" type="checkbox" :value="category.id">
            <span>{{ category.name }}</span>
            <small>{{ categoryCount(category.id) }}</small>
          </label>
        </section>

        <section class="filter-block">
          <h2>Compra rápida</h2>
          <label class="switch-row"><input v-model="inStockOnly" type="checkbox"><span><PackageCheck :size="17" />Em estoque</span></label>
          <label class="switch-row"><input v-model="onSaleOnly" type="checkbox"><span><BadgePercent :size="17" />Produtos em oferta</span></label>
          <label class="switch-row"><input v-model="featuredOnly" type="checkbox"><span><Sparkles :size="17" />Destaques da loja</span></label>
        </section>

        <section class="filter-block price-filter">
          <h2>Faixa de preço</h2>
          <div class="price-readout"><span>Até</span><strong>{{ storefront.products.length ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPriceLimit) : 'R$ 0,00' }}</strong></div>
          <input v-model.number="priceLimit" type="range" min="0" :max="priceCeiling" step="1" aria-label="Preço máximo">
        </section>

        <button class="clear-filters" type="button" :disabled="!activeFilterCount" @click="resetFilters">Limpar filtros</button>
      </aside>

      <section class="catalog-results">
        <div v-if="activeFilterCount" class="filter-summary">
          <span v-for="categoryId in selectedCategories" :key="categoryId">{{ categories.find(category => category.id === categoryId)?.name }}<button aria-label="Remover filtro" @click="selectedCategories = selectedCategories.filter(id => id !== categoryId)">x</button></span>
          <span v-if="inStockOnly">Em estoque</span>
          <span v-if="onSaleOnly">Em oferta</span>
          <span v-if="featuredOnly">Destaques</span>
          <span v-if="priceLimit > 0 && priceLimit < priceCeiling">Até {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceLimit) }}</span>
        </div>

        <div class="result-row"><span>{{ filtered.length }} {{ filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados' }}</span><span v-if="search">Busca por "{{ search }}"</span></div>
        <div v-if="filtered.length" class="catalog-grid"><BaseProductCard v-for="product in filtered" :key="product.id" :product="product" :storefront="storefront" /></div>
        <div v-else class="no-results alert"><Search :size="26" /><div><h2>Nenhum produto encontrado.</h2><p>Tente remover filtros ou buscar com menos palavras.</p></div><button class="btn btn-primary" type="button" @click="search = ''; resetFilters(); syncSearch()">Limpar busca e filtros</button></div>
      </section>
    </div>

    <button v-if="filtersOpen" class="filter-backdrop" type="button" aria-label="Fechar filtros" @click="filtersOpen = false"></button>
  </main>
</template>

<style scoped>
.catalog{max-width:1440px;margin:auto;padding:76px 32px 44px}.catalog-heading{padding:42px clamp(22px,4vw,52px);border:1px solid rgba(21,59,54,.09);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.86),rgba(229,244,239,.64));box-shadow:0 24px 70px rgba(30,70,62,.08)}.catalog-heading>span{color:var(--sf-primary);font:700 11px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase}.catalog-heading h1{max-width:930px;margin:14px 0 18px;font-family:var(--sf-display);font-size:clamp(50px,6.6vw,92px);font-weight:850;line-height:.9;letter-spacing:-.055em;text-wrap:balance}.catalog-heading p{max-width:620px;color:#647b76;font-size:16px;line-height:1.7}.catalog-tools{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:34px;padding:18px;border:1px solid rgba(21,59,54,.1);border-radius:16px;background:rgba(255,255,255,.76);box-shadow:0 18px 46px rgba(30,70,62,.06);backdrop-filter:blur(14px)}.search-field{display:flex;width:min(480px,100%);height:48px;align-items:center;gap:10px;padding:0 15px;border:1px solid #ccdbd7;border-radius:11px;background:#fff;color:#6a807b}.search-field input{min-width:0;flex:1;border:0;outline:0}.catalog-tools>div{display:flex;gap:8px}.catalog-tools button,.catalog-tools select{display:flex;height:42px;align-items:center;gap:8px;padding:0 14px;border:1px solid #d0ddd9;border-radius:10px;background:#fff;color:var(--sf-ink);font-size:12px;font-weight:600;transition:border-color .2s,transform .2s}.catalog-tools button:hover{border-color:#9bc9bc;transform:translateY(-1px)}.mobile-filter span{display:grid;min-width:18px;height:18px;place-items:center;border-radius:50%;background:var(--sf-primary);color:#fff;font-size:10px;font-weight:700}.catalog-body{display:grid;grid-template-columns:300px minmax(0,1fr);gap:24px;margin-top:24px}.filter-sidebar{align-self:start;position:sticky;top:158px;display:grid;gap:18px;padding:22px;border:1px solid rgba(21,59,54,.1);border-radius:18px;background:rgba(255,255,255,.86);box-shadow:0 24px 70px rgba(30,70,62,.09);backdrop-filter:blur(16px)}.filter-head{display:flex;align-items:start;justify-content:space-between;gap:16px;padding-bottom:16px;border-bottom:1px solid rgba(21,59,54,.09)}.filter-head div{display:grid;gap:4px}.filter-head span{color:var(--sf-primary);font:650 10px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase}.filter-head strong{font-size:21px;font-weight:700;letter-spacing:-.025em}.filter-head button{display:none;width:34px;height:34px;place-items:center;border:0;border-radius:9px;background:#f2f7f5;color:var(--sf-ink)}.filter-block{display:grid;gap:10px;padding-bottom:18px;border-bottom:1px solid rgba(21,59,54,.09)}.filter-block h2{margin:0 0 2px;font-size:13px;font-weight:650;letter-spacing:0}.check-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;min-height:36px;color:#435e5a;font-size:13px;font-weight:500;cursor:pointer}.check-row small{color:#8a9b97;font-size:11px;font-variant-numeric:tabular-nums}.check-row input,.switch-row input{width:16px;height:16px;accent-color:var(--sf-primary)}.switch-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:40px;cursor:pointer}.switch-row span{display:flex;align-items:center;gap:9px;color:#435e5a;font-size:13px;font-weight:550}.switch-row svg{color:var(--sf-primary)}.price-readout{display:flex;align-items:end;justify-content:space-between;gap:12px}.price-readout span{color:#71847f;font-size:12px}.price-readout strong{color:var(--sf-primary);font-size:20px;font-weight:750;font-variant-numeric:tabular-nums;letter-spacing:-.02em}.price-filter input[type=range]{width:100%;accent-color:var(--sf-primary)}.clear-filters{height:44px;border:1px solid rgba(21,59,54,.13);border-radius:11px;background:#f8faf8;color:var(--sf-ink);font-size:13px;font-weight:600}.clear-filters:disabled{cursor:not-allowed;opacity:.45}.catalog-results{min-width:0}.result-row{display:flex;justify-content:space-between;padding:0 0 18px;color:#71847f;font:650 11px ui-monospace,monospace;text-transform:uppercase}.catalog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.filter-summary{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-bottom:16px}.filter-summary span{display:inline-flex;align-items:center;gap:7px;min-height:30px;padding:0 10px;border:1px solid rgba(31,107,79,.18);border-radius:999px;background:#eef8f4;color:#315f54;font-size:12px;font-weight:550}.filter-summary button{border:0;background:transparent;color:inherit;font-weight:700;line-height:1}.no-results{display:grid;justify-items:center;padding:90px 20px;border:1px dashed #bfd0cb;border-radius:16px;background:rgba(255,255,255,.7);text-align:center;color:#71847f}.no-results h2{margin:18px 0 8px;color:var(--sf-ink);font-family:var(--sf-display);font-weight:700}.no-results p{margin:0}.no-results button{margin-top:22px;padding:12px 16px;border:0;border-radius:9px;background:var(--sf-primary);color:#fff;font-weight:650}.filter-backdrop{display:none}.no-results.alert{grid-template-columns:auto 1fr auto;justify-items:start;text-align:left}.no-results.alert h2{margin:0 0 6px}@media(max-width:1120px){.catalog-body{grid-template-columns:270px minmax(0,1fr)}.catalog-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:820px){.catalog{padding:50px 16px}.catalog-heading h1{font-size:52px}.catalog-tools{align-items:stretch;flex-direction:column}.search-field{width:100%}.catalog-tools>div{justify-content:space-between}.catalog-body{display:block}.filter-sidebar{position:fixed;left:14px;right:14px;top:88px;z-index:70;max-height:calc(100dvh - 108px);overflow:auto;opacity:0;pointer-events:none;transform:translateY(16px);transition:opacity .22s,transform .22s}.filter-sidebar.open{opacity:1;pointer-events:auto;transform:translateY(0)}.filter-head button{display:grid}.filter-backdrop{position:fixed;inset:0;z-index:60;display:block;border:0;background:rgba(10,24,21,.36)}.result-row{padding-top:20px}.no-results.alert{grid-template-columns:1fr;justify-items:center;text-align:center}}@media(max-width:650px){.catalog-grid{grid-template-columns:repeat(2,1fr);gap:12px}.catalog-tools select{min-width:0;flex:1}}
</style>
