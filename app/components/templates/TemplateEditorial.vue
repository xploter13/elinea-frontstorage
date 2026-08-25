<script setup lang="ts">
import type { StoreProduct, StorefrontPayload } from '#shared/types/storefront'

const props = defineProps<{ storefront: StorefrontPayload }>()
const products = computed(() => props.storefront.products.slice(0, 6))
const lead = computed(() => products.value.find(product => product.image_path) || products.value[0])
const productImage = (product?: StoreProduct) => product?.image_path || product?.variations?.find(variation => variation.image_path)?.image_path || null
const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

useSeoMeta({
  title: () => `${props.storefront.site.name} | Coleção atual`,
  description: () => `Conheça a seleção atual de ${props.storefront.site.name}.`,
})
</script>

<template>
  <div class="edit-shell">
    <header class="edit-header">
      <NuxtLink class="edit-logo" to="/">{{ storefront.site.name }}</NuxtLink>
      <nav aria-label="Navegação principal"><NuxtLink to="/produtos">Coleção</NuxtLink><NuxtLink to="/categorias">Categorias</NuxtLink></nav>
      <NuxtLink class="edit-bag" to="/carrinho">Sacola (0)</NuxtLink>
    </header>

    <main>
      <section class="edit-hero">
        <div class="edit-title">
          <p>Seleção {{ new Date().getFullYear() }}</p>
          <h1>Objetos para<br>uma vida <em>bem vivida.</em></h1>
        </div>
        <div class="edit-lead">
          <img v-if="productImage(lead)" :src="productImage(lead)!" :alt="lead?.name || ''" fetchpriority="high">
          <div v-else class="edit-placeholder"><span>{{ lead?.name.charAt(0) || storefront.site.name.charAt(0) }}</span></div>
        </div>
        <aside class="edit-intro">
          <p>Uma curadoria de produtos que combina presença, função e simplicidade para o cotidiano.</p>
          <NuxtLink to="/produtos">Descobrir a coleção</NuxtLink>
        </aside>
      </section>

      <section v-if="storefront.categories.length" class="edit-index" aria-label="Categorias">
        <span>Explore</span>
        <div><NuxtLink v-for="category in storefront.categories.slice(0, 5)" :key="category.id" :to="`/categoria/${category.slug}`">{{ category.name }}</NuxtLink></div>
      </section>

      <section class="edit-collection" aria-labelledby="collection-title">
        <div class="edit-collection-title"><span>Nossa escolha</span><h2 id="collection-title">Peças que merecem espaço.</h2></div>
        <div v-if="products.length" class="edit-grid">
          <article v-for="(product, index) in products" :key="product.id" :class="{ 'edit-featured': index === 0 }">
            <NuxtLink :to="`/produto/${product.slug}`" class="edit-image">
              <img v-if="productImage(product)" :src="productImage(product)!" :alt="product.name" loading="lazy">
              <div v-else class="edit-placeholder"><span>{{ product.name.charAt(0) }}</span></div>
            </NuxtLink>
            <div class="edit-meta"><div><small>{{ product.categories?.[0]?.name || 'Coleção' }}</small><h3>{{ product.name }}</h3></div><strong>{{ money(product.price) }}</strong></div>
          </article>
        </div>
        <div v-else class="edit-empty"><strong>A coleção está sendo preparada.</strong><span>Volte em breve para conhecer as novidades.</span></div>
      </section>

      <section class="edit-manifesto">
        <p>Escolher menos.<br>Escolher <em>melhor.</em></p>
        <NuxtLink to="/produtos">Ver todos os produtos</NuxtLink>
      </section>
    </main>
    <footer class="edit-footer"><strong>{{ storefront.site.name }}</strong><span>Curadoria e comércio digital por Elinea</span></footer>
  </div>
</template>

<style scoped>
:global(*){box-sizing:border-box}:global(body){margin:0}.edit-shell{--ink:#111317;--grey:#d8dce0;--blue:#265bff;min-height:100dvh;background:#f1f2f3;color:var(--ink);font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.edit-header{height:78px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 34px;border-bottom:1px solid #111317}.edit-logo{color:var(--ink);font-size:19px;font-weight:800;letter-spacing:-.04em;text-decoration:none}.edit-header nav{display:flex;gap:32px}.edit-header nav a,.edit-bag{color:var(--ink);font-size:12px;font-weight:700;letter-spacing:.04em;text-decoration:none}.edit-bag{justify-self:end}.edit-hero{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(340px,.9fr);grid-template-rows:auto 1fr;gap:24px;max-width:1500px;min-height:720px;margin:auto;padding:42px 34px 70px}.edit-title{position:relative;z-index:1;align-self:end;padding-bottom:20px}.edit-title>p,.edit-collection-title>span{margin:0 0 16px;color:#4d535b;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.edit-title h1{width:max-content;max-width:920px;margin:0;font-size:clamp(55px,7.4vw,118px);font-weight:500;line-height:.86;letter-spacing:-.075em}.edit-title h1 em,.edit-manifesto em{color:var(--blue);font-style:italic;line-height:1.1}.edit-lead{grid-column:2;grid-row:1/3;min-height:580px;overflow:hidden}.edit-lead img,.edit-image img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.85);transition:filter .35s,transform .6s}.edit-lead:hover img,.edit-image:hover img{filter:saturate(1);transform:scale(1.015)}.edit-placeholder{display:grid;place-items:center;width:100%;height:100%;min-height:320px;background:linear-gradient(145deg,#cbd0d6,#919aa4);color:#fff}.edit-placeholder span{font-size:clamp(100px,15vw,220px);font-weight:700;opacity:.3}.edit-intro{align-self:end;display:flex;align-items:end;justify-content:space-between;gap:30px;max-width:720px}.edit-intro p{max-width:410px;margin:0;color:#4d535b;font-size:16px;line-height:1.5}.edit-intro a,.edit-manifesto a{flex-shrink:0;color:var(--ink);font-size:12px;font-weight:800;text-decoration:none;border-bottom:1px solid;padding-bottom:5px}.edit-index{display:grid;grid-template-columns:180px 1fr;gap:30px;padding:28px 34px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}.edit-index>span{color:#555b62;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.14em}.edit-index>div{display:flex;flex-wrap:wrap;gap:12px 36px}.edit-index a{color:var(--ink);font-size:13px;font-weight:700;text-decoration:none}.edit-index a:hover{color:var(--blue)}.edit-collection{max-width:1500px;margin:auto;padding:130px 34px}.edit-collection-title{display:grid;grid-template-columns:1fr 2fr;margin-bottom:56px}.edit-collection-title h2{max-width:780px;margin:0;font-size:clamp(40px,5.5vw,80px);font-weight:500;line-height:.95;letter-spacing:-.06em}.edit-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:70px 20px}.edit-grid article{grid-column:span 4}.edit-grid article:nth-child(2){grid-column:6/span 3;margin-top:160px}.edit-grid article:nth-child(3){grid-column:10/span 3;margin-top:50px}.edit-grid article:nth-child(4){grid-column:2/span 4}.edit-grid article:nth-child(5){grid-column:7/span 3;margin-top:130px}.edit-grid article:nth-child(6){grid-column:10/span 3}.edit-grid .edit-featured{grid-column:span 5}.edit-image{display:block;aspect-ratio:4/5;overflow:hidden;background:var(--grey)}.edit-meta{display:flex;align-items:start;justify-content:space-between;gap:20px;padding-top:15px}.edit-meta small{color:#626870;font-size:10px;text-transform:uppercase;letter-spacing:.1em}.edit-meta h3{margin:5px 0 0;font-size:14px}.edit-meta strong{padding-top:17px;font-size:13px;white-space:nowrap}.edit-empty{display:grid;gap:8px;padding:80px 0;border-top:1px solid #969ba1;color:#5d636a}.edit-empty strong{color:var(--ink);font-size:30px;font-weight:500}.edit-manifesto{display:flex;align-items:end;justify-content:space-between;gap:30px;padding:110px 34px;background:#d9dde1}.edit-manifesto p{margin:0;font-size:clamp(54px,8vw,120px);font-weight:500;line-height:.83;letter-spacing:-.075em}.edit-footer{display:flex;justify-content:space-between;padding:36px 34px;background:#d9dde1;border-top:1px solid #111317;font-size:12px}.edit-footer span{color:#595f66}@media(max-width:900px){.edit-header{grid-template-columns:1fr auto}.edit-header nav{display:none}.edit-hero{grid-template-columns:1fr;grid-template-rows:auto;min-height:auto}.edit-title,.edit-lead,.edit-intro{grid-column:auto;grid-row:auto}.edit-title h1{width:auto}.edit-lead{height:62vw;min-height:420px}.edit-collection-title{grid-template-columns:1fr}.edit-grid article,.edit-grid .edit-featured,.edit-grid article:nth-child(n){grid-column:span 6;margin-top:0}.edit-manifesto{align-items:start;flex-direction:column}}@media(max-width:560px){.edit-header,.edit-hero,.edit-collection,.edit-manifesto{padding-left:18px;padding-right:18px}.edit-hero{padding-top:30px}.edit-title h1{font-size:clamp(50px,15vw,76px)}.edit-intro{align-items:start;flex-direction:column}.edit-index{grid-template-columns:1fr;padding:24px 18px}.edit-collection{padding-top:90px;padding-bottom:90px}.edit-grid{gap:48px 10px}.edit-grid article,.edit-grid .edit-featured,.edit-grid article:nth-child(n){grid-column:span 6}.edit-meta{display:grid;gap:2px}.edit-meta strong{padding-top:0}.edit-manifesto{padding-top:80px;padding-bottom:80px}.edit-footer{padding:28px 18px;gap:20px;flex-direction:column}}@media(prefers-reduced-motion:reduce){.edit-lead img,.edit-image img{transition:none!important}}
</style>
