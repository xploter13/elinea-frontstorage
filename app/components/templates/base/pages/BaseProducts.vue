<script setup lang="ts">
import { Search, SlidersHorizontal } from '@lucide/vue'
import type { StoreProduct, StorefrontPayload } from '#shared/types/storefront'
import BaseProductCard from '../components/BaseProductCard.vue'
const props = defineProps<{ products: StoreProduct[], storefront: StorefrontPayload, title?: string, description?: string }>()
const route = useRoute()
const router = useRouter()
const search = ref(String(route.query.busca || ''))
const selectedCategories = ref<number[]>([])
const inStockOnly = ref(false)
const onSaleOnly = ref(false)
const sort = ref<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance')
const filtersOpen = ref(false)
const categories = computed(() => {
  const map = new Map<number, StoreProduct['categories'][number]>()
  props.products.forEach(product => product.categories.forEach(category => map.set(category.id, category)))
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
})
const activeFilterCount = computed(() => selectedCategories.value.length + Number(inStockOnly.value) + Number(onSaleOnly.value))
const filtered = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')
  const result = props.products.filter((item) => {
    const matchesTerm = !term || `${item.name} ${item.categories.map(category => category.name).join(' ')}`.toLocaleLowerCase('pt-BR').includes(term)
    const matchesCategory = !selectedCategories.value.length || item.categories.some(category => selectedCategories.value.includes(category.id))
    const matchesStock = !inStockOnly.value || item.stock > 0
    const matchesSale = !onSaleOnly.value || Boolean(item.original_price && item.original_price > item.price)
    return matchesTerm && matchesCategory && matchesStock && matchesSale
  })
  return [...result].sort((a, b) => {
    if (sort.value === 'price-asc') return a.price - b.price
    if (sort.value === 'price-desc') return b.price - a.price
    if (sort.value === 'name') return a.name.localeCompare(b.name, 'pt-BR')
    return Number(b.is_featured) - Number(a.is_featured)
  })
})
const resetFilters = () => { selectedCategories.value = []; inStockOnly.value = false; onSaleOnly.value = false }
const syncSearch = () => router.replace({ query: { ...route.query, busca: search.value.trim() || undefined } })
watch(() => route.query.busca, value => { search.value = String(value || '') })
</script>

<template>
  <main class="catalog"><div class="catalog-heading"><span>Catálogo da farmácia</span><h1>{{ title || 'Tudo para cuidar de você.' }}</h1><p>{{ description || 'Encontre medicamentos, higiene, beleza e itens para o cuidado de toda a família.' }}</p></div><div class="catalog-tools"><label class="input input-bordered"><Search :size="18"/><span class="sr-only">Buscar nesta seleção</span><input v-model="search" placeholder="Buscar nesta seleção" @keyup.enter="syncSearch" @blur="syncSearch"></label><div><button class="btn btn-outline" type="button" @click="filtersOpen=true"><SlidersHorizontal :size="16"/>Filtros<span v-if="activeFilterCount" class="badge badge-primary badge-sm">{{ activeFilterCount }}</span></button><select v-model="sort" class="select select-bordered" aria-label="Ordenar produtos"><option value="relevance">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select></div></div><div v-if="activeFilterCount" class="filter-summary"><span v-for="categoryId in selectedCategories" :key="categoryId" class="badge badge-outline gap-1">{{ categories.find(category=>category.id===categoryId)?.name }}<button aria-label="Remover filtro" @click="selectedCategories=selectedCategories.filter(id=>id!==categoryId)">×</button></span><span v-if="inStockOnly" class="badge badge-outline">Em estoque</span><span v-if="onSaleOnly" class="badge badge-secondary badge-outline">Em oferta</span><button class="btn btn-ghost btn-xs" @click="resetFilters">Limpar filtros</button></div><div class="result-row"><span>{{ filtered.length }} {{ filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados' }}</span><span v-if="search">Busca por “{{ search }}”</span></div><div v-if="filtered.length" class="catalog-grid"><BaseProductCard v-for="product in filtered" :key="product.id" :product="product" :storefront="storefront"/></div><div v-else class="no-results alert"><Search :size="26"/><div><h2>Nenhum produto encontrado.</h2><p>Tente remover filtros ou buscar com menos palavras.</p></div><button class="btn btn-primary" type="button" @click="search='';resetFilters();syncSearch()">Limpar busca e filtros</button></div><dialog v-if="filtersOpen" class="modal modal-open"><div class="modal-box max-w-lg"><h2 class="text-3xl font-bold">Filtrar produtos</h2><p class="mt-2 text-sm opacity-60">Combine categorias e disponibilidade.</p><fieldset class="mt-6"><legend class="mb-3 text-sm font-bold">Categorias</legend><div class="grid gap-2 sm:grid-cols-2"><label v-for="category in categories" :key="category.id" class="label cursor-pointer justify-start gap-3 rounded-box border border-base-300 px-3"><input v-model="selectedCategories" type="checkbox" class="checkbox checkbox-primary checkbox-sm" :value="category.id"><span class="label-text">{{ category.name }}</span></label></div></fieldset><div class="divider"></div><label class="label cursor-pointer"><span class="label-text font-semibold">Mostrar apenas produtos em estoque</span><input v-model="inStockOnly" type="checkbox" class="toggle toggle-primary"></label><label class="label cursor-pointer"><span class="label-text font-semibold">Mostrar apenas ofertas</span><input v-model="onSaleOnly" type="checkbox" class="toggle toggle-secondary"></label><div class="modal-action"><button class="btn btn-ghost" @click="resetFilters">Limpar</button><button class="btn btn-primary" @click="filtersOpen=false">Ver {{ filtered.length }} produtos</button></div></div><form method="dialog" class="modal-backdrop"><button @click="filtersOpen=false">fechar</button></form></dialog></main>
</template>

<style scoped>
.catalog{max-width:1440px;margin:auto;padding:70px 32px 40px}.catalog-heading>span{color:var(--sf-primary);font:800 10px ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.catalog-heading h1{max-width:930px;margin:13px 0 18px;font-family:"Trebuchet MS",sans-serif;font-size:clamp(52px,7vw,96px);line-height:.87;letter-spacing:-.075em}.catalog-heading p{max-width:620px;color:#647b76;line-height:1.65}.catalog-tools{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:58px;padding:18px 0;border-block:1px solid #d8e5e1}.catalog-tools>label{display:flex;width:min(440px,100%);height:45px;align-items:center;gap:10px;padding:0 14px;border:1px solid #ccdbd7;border-radius:10px;background:#fff;color:#6a807b}.catalog-tools input{min-width:0;flex:1;border:0;outline:0}.catalog-tools>div{display:flex;gap:8px}.catalog-tools button{display:flex;height:40px;align-items:center;gap:8px;padding:0 14px;border:1px solid #d0ddd9;border-radius:9px;background:#fff;color:var(--sf-ink);font-size:11px;font-weight:800}.result-row{display:flex;justify-content:space-between;padding:21px 0;color:#71847f;font:700 10px ui-monospace,monospace;text-transform:uppercase}.catalog-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:45px 16px}.no-results{display:grid;justify-items:center;padding:90px 20px;border:1px dashed #bfd0cb;border-radius:16px;text-align:center;color:#71847f}.no-results h2{margin:18px 0 8px;color:var(--sf-ink);font-family:"Trebuchet MS",sans-serif}.no-results p{margin:0}.no-results button{margin-top:22px;padding:12px 16px;border:0;border-radius:9px;background:var(--sf-primary);color:#fff;font-weight:800}@media(max-width:900px){.catalog-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:650px){.catalog{padding:50px 16px}.catalog-heading h1{font-size:54px}.catalog-tools{align-items:stretch;flex-direction:column}.catalog-tools>label{width:100%}.catalog-tools>div{justify-content:space-between}.catalog-grid{grid-template-columns:repeat(2,1fr);gap:35px 10px}}
.filter-summary{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-top:18px}.filter-summary .badge button{margin-left:4px;font-size:16px}.catalog-tools .input{width:min(440px,100%)}.catalog-tools .select{min-width:180px}.no-results.alert{grid-template-columns:auto 1fr auto;justify-items:start;text-align:left}.no-results.alert h2{margin:0 0 6px}@media(max-width:650px){.catalog-tools .select{min-width:0;flex:1}.no-results.alert{grid-template-columns:1fr;justify-items:center;text-align:center}}
</style>
