<script setup lang="ts">
import type { StoreProduct, StorefrontPayload } from '#shared/types/storefront'

const props = defineProps<{ storefront: StorefrontPayload }>()
const categories = computed(() => props.storefront.categories.filter(category => category.is_active).slice(0, 6))
const products = computed(() => {
  const featured = props.storefront.products.filter(product => product.is_featured)
  return (featured.length ? featured : props.storefront.products).slice(0, 8)
})
const heroProduct = computed(() => products.value.find(product => product.image_path) || products.value[0])
const productImage = (product?: StoreProduct) => product?.image_path || product?.variations.find(variation => variation.image_path)?.image_path || null
const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

useSeoMeta({
  title: () => `${props.storefront.site.name} | Compre online`,
  description: () => `Ofertas e produtos selecionados de ${props.storefront.site.name}.`,
})
</script>

<template>
  <div class="market-shell">
    <div class="market-topbar">Compra segura e seleção fresquinha todos os dias</div>
    <header class="market-header">
      <NuxtLink class="market-brand" to="/">{{ storefront.site.name }}</NuxtLink>
      <nav class="market-nav" aria-label="Navegação principal">
        <NuxtLink to="/">Início</NuxtLink>
        <NuxtLink to="/produtos">Produtos</NuxtLink>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
      </nav>
      <NuxtLink class="market-cart" to="/carrinho">Minha cesta <span>0</span></NuxtLink>
    </header>

    <main>
      <section class="market-hero">
        <div class="market-hero-copy">
          <p class="market-kicker">Sua compra, do seu jeito</p>
          <h1>Mais sabor.<br><em>Menos rotina.</em></h1>
          <p>Encontre seus favoritos e descubra novidades para deixar cada refeição mais gostosa.</p>
          <NuxtLink class="market-primary" to="/produtos">Ver produtos</NuxtLink>
        </div>
        <div class="market-hero-visual">
          <div v-if="heroProduct" class="market-hero-card">
            <img v-if="productImage(heroProduct)" :src="productImage(heroProduct)!" :alt="heroProduct.name" fetchpriority="high">
            <div v-else class="market-photo-placeholder" aria-hidden="true"><span>{{ heroProduct.name.charAt(0) }}</span></div>
            <div class="market-hero-product">
              <span>Escolha da casa</span>
              <strong>{{ heroProduct.name }}</strong>
              <b>{{ money(heroProduct.price) }}</b>
            </div>
          </div>
          <div v-else class="market-empty-hero">Novidades chegando à vitrine</div>
        </div>
      </section>

      <section v-if="categories.length" class="market-categories" aria-labelledby="market-categories-title">
        <div class="market-section-heading">
          <h2 id="market-categories-title">Compre por categoria</h2>
          <NuxtLink to="/categorias">Ver todas</NuxtLink>
        </div>
        <div class="market-category-row">
          <NuxtLink v-for="(category, index) in categories" :key="category.id" :to="`/categoria/${category.slug}`" class="market-category">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ category.name }}
          </NuxtLink>
        </div>
      </section>

      <section class="market-products" aria-labelledby="market-products-title">
        <div class="market-section-heading">
          <div><p>Da nossa vitrine</p><h2 id="market-products-title">Destaques da semana</h2></div>
          <NuxtLink v-if="products.length" to="/produtos">Explorar tudo</NuxtLink>
        </div>
        <div v-if="products.length" class="market-product-grid">
          <article v-for="product in products" :key="product.id" class="market-product">
            <NuxtLink :to="`/produto/${product.slug}`" class="market-product-image">
              <img v-if="productImage(product)" :src="productImage(product)!" :alt="product.name" loading="lazy">
              <div v-else class="market-photo-placeholder" aria-hidden="true"><span>{{ product.name.charAt(0) }}</span></div>
              <small v-if="product.original_price && product.original_price > product.price">Oferta</small>
            </NuxtLink>
            <div class="market-product-info">
              <NuxtLink :to="`/produto/${product.slug}`"><h3>{{ product.name }}</h3></NuxtLink>
              <div><span v-if="product.original_price">{{ money(product.original_price) }}</span><strong>{{ money(product.price) }}</strong></div>
            </div>
          </article>
        </div>
        <div v-else class="market-empty">Os primeiros produtos desta loja aparecerão aqui em breve.</div>
      </section>
    </main>

    <footer class="market-footer"><strong>{{ storefront.site.name }}</strong><span>Uma loja Elinea</span></footer>
  </div>
</template>

<style scoped>
:global(*){box-sizing:border-box}:global(body){margin:0}.market-shell{--ink:#16352a;--green:#176b47;--lime:#dff56b;--paper:#f4f6ed;background:var(--paper);color:var(--ink);font-family:"Arial Nova",Arial,sans-serif;min-height:100dvh}.market-topbar{background:var(--ink);color:#fff;text-align:center;padding:9px 16px;font-size:12px;font-weight:700;letter-spacing:.04em}.market-header{height:76px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:28px;max-width:1360px;margin:auto;padding:0 32px;border-bottom:1px solid #16352a24}.market-brand{color:var(--ink);font-size:23px;font-weight:900;letter-spacing:-.05em;text-decoration:none;white-space:nowrap}.market-nav{display:flex;gap:28px}.market-nav a,.market-section-heading>a{color:var(--ink);font-size:14px;font-weight:700;text-decoration:none}.market-cart{justify-self:end;display:flex;align-items:center;gap:10px;color:var(--ink);font-size:14px;font-weight:800;text-decoration:none}.market-cart span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--lime)}.market-hero{max-width:1360px;margin:auto;padding:36px 32px 64px;display:grid;grid-template-columns:minmax(0,.86fr) minmax(420px,1.14fr);gap:32px;min-height:620px}.market-hero-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:24px 3vw 24px 0}.market-kicker,.market-section-heading p{margin:0 0 18px;color:var(--green);font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.market-hero h1{max-width:720px;margin:0;font-size:clamp(54px,6.2vw,102px);line-height:.88;letter-spacing:-.07em}.market-hero h1 em{color:var(--green);font-style:italic;line-height:1.1}.market-hero-copy>p:not(.market-kicker){max-width:500px;margin:28px 0;color:#52645c;font-size:17px;line-height:1.6}.market-primary{display:inline-flex;padding:15px 24px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:900;text-decoration:none;transition:transform .2s,background .2s}.market-primary:hover{background:var(--green);transform:translateY(-2px)}.market-primary:active{transform:translateY(1px)}.market-hero-visual{position:relative;display:grid;min-height:520px;border-radius:28px;overflow:hidden;background:var(--lime)}.market-hero-card{position:relative;display:grid;min-height:100%}.market-hero-card>img{width:100%;height:100%;object-fit:cover}.market-hero-card>.market-photo-placeholder{min-height:520px}.market-hero-product{position:absolute;right:20px;bottom:20px;display:grid;width:min(260px,calc(100% - 40px));padding:20px;border-radius:18px;background:#f4f6edeb;backdrop-filter:blur(10px)}.market-hero-product span{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.market-hero-product strong{margin:7px 0 18px;font-size:20px}.market-hero-product b{color:var(--green);font-size:18px}.market-photo-placeholder{display:grid;place-items:center;width:100%;height:100%;min-height:260px;background:linear-gradient(145deg,#dff56b,#a9d986);color:var(--ink)}.market-photo-placeholder span{font-size:clamp(90px,12vw,180px);font-weight:900;opacity:.32}.market-empty-hero{display:grid;place-items:end start;padding:40px;font-size:clamp(36px,5vw,70px);font-weight:900;line-height:.95;letter-spacing:-.05em}.market-categories,.market-products{max-width:1360px;margin:auto;padding:70px 32px}.market-section-heading{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:32px}.market-section-heading h2{margin:0;font-size:clamp(34px,4vw,60px);line-height:1;letter-spacing:-.05em}.market-section-heading>a{border-bottom:1px solid;padding-bottom:4px}.market-category-row{display:grid;grid-template-columns:repeat(6,1fr);border-top:1px solid #16352a38;border-bottom:1px solid #16352a38}.market-category{display:flex;min-height:140px;padding:20px 14px;border-right:1px solid #16352a38;color:var(--ink);font-size:17px;font-weight:800;text-decoration:none;flex-direction:column;justify-content:space-between;transition:background .2s}.market-category:last-child{border-right:0}.market-category span{color:var(--green);font-size:11px;letter-spacing:.12em}.market-category:hover{background:var(--lime)}.market-products{padding-top:80px}.market-product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:36px 18px}.market-product-image{position:relative;display:block;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:#e7ebdf}.market-product-image img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.market-product-image:hover img{transform:scale(1.025)}.market-product-image small{position:absolute;top:14px;left:14px;padding:7px 10px;border-radius:999px;background:var(--lime);color:var(--ink);font-weight:800}.market-product-info{display:flex;justify-content:space-between;gap:16px;padding-top:15px}.market-product-info a{color:var(--ink);text-decoration:none}.market-product-info h3{margin:0;font-size:15px}.market-product-info>div{display:grid;justify-items:end;flex-shrink:0}.market-product-info span{color:#728078;font-size:12px;text-decoration:line-through}.market-product-info strong{font-size:15px}.market-empty{padding:56px;border:1px dashed #87958d;text-align:center;color:#52645c}.market-footer{max-width:1360px;margin:80px auto 0;padding:38px 32px;display:flex;justify-content:space-between;border-top:1px solid #16352a38;font-size:14px}.market-footer span{color:#65746c}@media(max-width:900px){.market-header{grid-template-columns:1fr auto}.market-nav{display:none}.market-hero{grid-template-columns:1fr;min-height:auto}.market-hero-copy{padding:34px 0}.market-hero h1{font-size:clamp(54px,12vw,88px)}.market-category-row{grid-template-columns:repeat(3,1fr)}.market-category:nth-child(3){border-right:0}.market-product-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.market-header,.market-hero,.market-categories,.market-products{padding-left:18px;padding-right:18px}.market-cart{font-size:0}.market-cart span{font-size:13px}.market-hero{padding-top:10px;gap:14px}.market-hero-visual{min-height:420px}.market-hero-copy>p:not(.market-kicker){font-size:15px}.market-category-row{grid-template-columns:repeat(2,1fr)}.market-category:nth-child(3){border-right:1px solid #16352a38}.market-category:nth-child(even){border-right:0}.market-product-grid{gap:28px 10px}.market-product-info{display:grid}.market-product-info>div{justify-items:start}.market-footer{margin-top:40px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}.market-primary,.market-product-image img{transition:none!important}}
</style>
