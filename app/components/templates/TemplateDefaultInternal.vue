<script setup lang="ts">
import type {StoreProduct, StorefrontPayload} from '#shared/types/storefront'
import type {StorefrontPage} from '~/utils/storefront-page'

const props = defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
const money = (value: number) => new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value)
const image = (product: StoreProduct) => product.image_path || product.variations?.find(item => item.image_path)?.image_path || null
const product = computed(() => {
  const page = props.page
  return page.kind === 'product' ? props.storefront.products.find(item => item.slug === page.slug) : undefined
})
const category = computed(() => {
  const page = props.page
  return page.kind === 'category' ? props.storefront.categories.find(item => item.slug === page.slug) : undefined
})
const products = computed(() => category.value
    ? props.storefront.products.filter(item => item.categories?.some(itemCategory => itemCategory.id === category.value?.id))
    : props.storefront.products)
const heading = computed(() => category.value?.name || (props.page.kind === 'categories' ? 'Todas as categorias' : 'Todos os produtos'))
</script>

<template>
  <div class="market-inner">
    <div class="topbar">Compra segura e seleção fresquinha todos os dias</div>
    <header>
      <NuxtLink class="brand" to="/">{{ storefront.site.name }}</NuxtLink>
      <nav aria-label="Navegação principal">
        <NuxtLink to="/">Início</NuxtLink>
        <NuxtLink to="/produtos">Produtos</NuxtLink>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
      </nav>
      <NuxtLink class="cart" to="/carrinho">Minha cesta <span>0</span></NuxtLink>
    </header>

    <main v-if="page.kind === 'product' && product" class="product-detail">
      <div class="product-photo">
        <img v-if="image(product)" :src="image(product)!" :alt="product.name">
        <div v-else class="placeholder" aria-hidden="true">{{ product.name.charAt(0) }}</div>
      </div>
      <section class="product-copy">
        <NuxtLink class="back" to="/produtos">Voltar aos produtos</NuxtLink>
        <p>{{ product.categories?.[0]?.name || 'Seleção da loja' }}</p>
        <h1>{{ product.name }}</h1>
        <div class="prices"><s v-if="product.original_price">{{
            money(product.original_price)
          }}</s><strong>{{ money(product.price) }}</strong></div>
        <p class="description">
          {{ product.description || product.excerpt || 'Um produto selecionado especialmente para a sua rotina.' }}</p>
        <button type="button" disabled>Adicionar à cesta</button>
        <small v-if="product.stock > 0">{{ product.stock }} unidades disponíveis</small><small v-else>Produto
        indisponível</small>
      </section>
    </main>

    <main v-else-if="page.kind === 'cart'" class="empty-page">
      <span>0 itens</span>
      <h1>Sua cesta está vazia.</h1>
      <p>Escolha seus favoritos e volte aqui para finalizar a compra.</p>
      <NuxtLink to="/produtos">Explorar produtos</NuxtLink>
    </main>

    <main v-else>
      <section class="page-heading"><p>{{
          page.kind === 'categories' ? 'Encontre do seu jeito' : 'Vitrine completa'
        }}</p>
        <h1>{{ heading }}</h1><span v-if="page.kind !== 'categories'">{{ products.length }} produtos</span></section>
      <section v-if="page.kind === 'categories'" class="category-grid">
        <NuxtLink v-for="(item, index) in storefront.categories" :key="item.id" :to="`/categoria/${item.slug}`">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description || 'Conheça a seleção desta categoria.' }}</p></NuxtLink>
        <div v-if="!storefront.categories.length" class="empty">As categorias aparecerão aqui em breve.</div>
      </section>
      <section v-else class="product-grid">
        <article v-for="item in products" :key="item.id">
          <NuxtLink class="image" :to="`/produto/${item.slug}`"><img v-if="image(item)" :src="image(item)!"
                                                                     :alt="item.name" loading="lazy">
            <div v-else class="placeholder" aria-hidden="true">{{ item.name.charAt(0) }}</div>
            <small v-if="item.original_price && item.original_price > item.price">Oferta</small></NuxtLink>
          <div>
            <NuxtLink :to="`/produto/${item.slug}`"><h2>{{ item.name }}</h2></NuxtLink>
            <p><s v-if="item.original_price">{{ money(item.original_price) }}</s><strong>{{
                money(item.price)
              }}</strong></p></div>
        </article>
        <div v-if="!products.length" class="empty">Nenhum produto disponível nesta seleção.</div>
      </section>
    </main>
    <footer><strong>{{ storefront.site.name }}</strong><span>Uma loja Elinea</span></footer>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box
}

:global(body) {
  margin: 0
}

.market-inner {
  --ink: #16352a;
  --green: #176b47;
  --lime: #dff56b;
  --paper: #f4f6ed;
  min-height: 100dvh;
  background: var(--paper);
  color: var(--ink);
  font-family: "Arial Nova", Arial, sans-serif
}

.topbar {
  padding: 9px 16px;
  background: var(--ink);
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 700
}

header {
  height: 76px;
  display: grid;
  grid-template-columns:1fr auto 1fr;
  align-items: center;
  gap: 28px;
  max-width: 1360px;
  margin: auto;
  padding: 0 32px;
  border-bottom: 1px solid #16352a24
}

.brand {
  color: var(--ink);
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -.05em;
  text-decoration: none
}

nav {
  display: flex;
  gap: 28px
}

nav a, .cart {
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none
}

.cart {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 10px
}

.cart span {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--lime)
}

.page-heading {
  display: grid;
  grid-template-columns:1fr auto;
  align-items: end;
  max-width: 1360px;
  margin: auto;
  padding: 86px 32px 42px
}

.page-heading p {
  grid-column: 1/-1;
  margin: 0 0 14px;
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase
}

.page-heading h1 {
  margin: 0;
  font-size: clamp(52px, 7vw, 104px);
  line-height: .9;
  letter-spacing: -.07em
}

.page-heading span {
  font-size: 14px;
  font-weight: 800
}

.product-grid {
  display: grid;
  grid-template-columns:repeat(4, 1fr);
  gap: 44px 18px;
  max-width: 1360px;
  margin: auto;
  padding: 24px 32px 100px
}

.image {
  position: relative;
  display: block;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 18px;
  background: #e7ebdf
}

.image img, .product-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s
}

.image:hover img {
  transform: scale(1.025)
}

.image small {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--lime);
  font-weight: 800
}

.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: linear-gradient(145deg, var(--lime), #a9d986);
  font-size: 120px;
  font-weight: 900;
  opacity: .72
}

.product-grid article > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 15px
}

.product-grid a {
  color: var(--ink);
  text-decoration: none
}

.product-grid h2 {
  margin: 0;
  font-size: 15px
}

.product-grid p {
  display: grid;
  justify-items: end;
  margin: 0
}

.product-grid s {
  color: #728078;
  font-size: 12px
}

.category-grid {
  display: grid;
  grid-template-columns:repeat(3, 1fr);
  max-width: 1360px;
  margin: auto;
  padding: 24px 32px 110px
}

.category-grid a {
  min-height: 260px;
  padding: 26px;
  border-top: 1px solid #16352a55;
  border-right: 1px solid #16352a55;
  color: var(--ink);
  text-decoration: none
}

.category-grid a:nth-child(3n) {
  border-right: 0
}

.category-grid a:hover {
  background: var(--lime)
}

.category-grid span {
  color: var(--green);
  font-size: 12px;
  font-weight: 900
}

.category-grid h2 {
  margin: 70px 0 12px;
  font-size: 30px;
  letter-spacing: -.04em
}

.category-grid p {
  max-width: 30ch;
  color: #52645c;
  line-height: 1.5
}

.product-detail {
  display: grid;
  grid-template-columns:minmax(0, 1.15fr) minmax(360px, .85fr);
  gap: 7vw;
  max-width: 1360px;
  margin: auto;
  padding: 70px 32px 110px
}

.product-photo {
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 28px;
  background: #e7ebdf
}

.product-copy {
  align-self: center
}

.back {
  display: inline-block;
  margin-bottom: 60px;
  color: var(--ink);
  font-size: 13px;
  font-weight: 800
}

.product-copy > p:first-of-type {
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .12em
}

.product-copy h1 {
  margin: 14px 0 28px;
  font-size: clamp(48px, 5.5vw, 82px);
  line-height: .92;
  letter-spacing: -.065em
}

.prices {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 25px
}

.prices s {
  color: #728078;
  font-size: 16px
}

.description {
  max-width: 54ch;
  margin: 34px 0;
  color: #52645c;
  line-height: 1.7
}

.product-copy button, .empty-page a {
  display: inline-flex;
  padding: 16px 25px;
  border: 0;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-weight: 900;
  text-decoration: none
}

.product-copy button:disabled {
  cursor: not-allowed;
  opacity: .65
}

.product-copy small {
  display: block;
  margin-top: 14px;
  color: #65746c
}

.empty-page {
  display: grid;
  justify-items: start;
  align-content: center;
  min-height: 620px;
  max-width: 1360px;
  margin: auto;
  padding: 70px 32px
}

.empty-page > span {
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase
}

.empty-page h1 {
  max-width: 800px;
  margin: 16px 0;
  font-size: clamp(54px, 8vw, 110px);
  line-height: .9;
  letter-spacing: -.07em
}

.empty-page p {
  margin: 0 0 30px;
  color: #52645c
}

.empty {
  grid-column: 1/-1;
  padding: 70px;
  border: 1px dashed #87958d;
  text-align: center
}

footer {
  display: flex;
  justify-content: space-between;
  max-width: 1360px;
  margin: 60px auto 0;
  padding: 38px 32px;
  border-top: 1px solid #16352a38;
  font-size: 14px
}

footer span {
  color: #65746c
}

@media (max-width: 900px) {
  header {
    grid-template-columns:1fr auto
  }

  nav {
    display: none
  }

  .product-grid {
    grid-template-columns:repeat(2, 1fr)
  }

  .category-grid {
    grid-template-columns:repeat(2, 1fr)
  }

  .category-grid a:nth-child(3n) {
    border-right: 1px solid #16352a55
  }

  .category-grid a:nth-child(2n) {
    border-right: 0
  }

  .product-detail {
    grid-template-columns:1fr
  }

  .product-photo {
    max-height: 650px
  }

  .back {
    margin-bottom: 30px
  }
}

@media (max-width: 560px) {
  header, .page-heading, .product-grid, .category-grid, .product-detail, .empty-page {
    padding-left: 18px;
    padding-right: 18px
  }

  .cart {
    font-size: 0
  }

  .cart span {
    font-size: 13px
  }

  .page-heading {
    grid-template-columns:1fr;
    gap: 16px;
    padding-top: 60px
  }

  .product-grid {
    gap: 32px 10px
  }

  .product-grid article > div {
    display: grid
  }

  .product-grid p {
    justify-items: start
  }

  .category-grid {
    grid-template-columns:1fr
  }

  .category-grid a, .category-grid a:nth-child(n) {
    border-right: 0
  }

  .product-detail {
    padding-top: 30px
  }

  .product-copy h1 {
    font-size: 52px
  }
}

@media (prefers-reduced-motion: reduce) {
  .image img {
    transition: none
  }
}
</style>
