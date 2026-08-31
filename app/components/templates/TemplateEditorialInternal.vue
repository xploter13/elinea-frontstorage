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
const products = computed(() => category.value ? props.storefront.products.filter(item => item.categories?.some(value => value.id === category.value?.id)) : props.storefront.products)
const heading = computed(() => category.value?.name || (props.page.kind === 'categories' ? 'Índice de categorias.' : 'A coleção completa.'))
</script>

<template>
  <div class="editorial-inner">
    <header>
      <NuxtLink class="logo" to="/">{{ storefront.site.name }}</NuxtLink>
      <nav aria-label="Navegação principal">
        <NuxtLink to="/produtos">Coleção</NuxtLink>
        <NuxtLink to="/categorias">Categorias</NuxtLink>
        <NuxtLink to="/conta">Conta</NuxtLink>
      </nav>
      <NuxtLink class="bag" to="/carrinho">Sacola (0)</NuxtLink>
    </header>
    <main v-if="page.kind === 'product' && product" class="detail">
      <section class="copy">
        <NuxtLink class="back" to="/produtos">Voltar à coleção</NuxtLink>
        <p>{{ product.categories?.[0]?.name || 'Coleção atual' }}</p>
        <h1>{{ product.name }}</h1>
        <div class="price"><s v-if="product.original_price">{{
            money(product.original_price)
          }}</s>{{ money(product.price) }}
        </div>
        <p class="description">{{
            product.description || product.excerpt || 'Uma peça escolhida por sua presença, função e simplicidade.'
          }}</p>
        <button type="button" disabled>Adicionar à sacola</button>
        <small>{{ product.stock > 0 ? `${product.stock} unidades disponíveis` : 'Peça indisponível' }}</small></section>
      <div class="photo"><img v-if="image(product)" :src="image(product)!" :alt="product.name">
        <div v-else class="placeholder">{{ product.name.charAt(0) }}</div>
      </div>
    </main>
    <main v-else-if="page.kind === 'cart'" class="cart-empty"><span>Sacola / 0</span>
      <h1>Ainda há<br>espaço <em>aqui.</em></h1>
      <p>Sua seleção começa na coleção atual.</p>
      <NuxtLink to="/produtos">Descobrir peças</NuxtLink>
    </main>
    <main v-else>
      <section class="heading"><span>{{ page.kind === 'categories' ? 'Explore' : `${products.length} peças` }}</span>
        <h1>{{ heading }}</h1></section>
      <section v-if="page.kind === 'categories'" class="categories">
        <NuxtLink v-for="(item,index) in storefront.categories" :key="item.id" :to="`/categoria/${item.slug}`">
          <small>{{ String(index + 1).padStart(2, '0') }}</small>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description || 'Uma curadoria para descobrir com calma.' }}</p></NuxtLink>
        <div v-if="!storefront.categories.length" class="empty">O índice está sendo preparado.</div>
      </section>
      <section v-else class="grid">
        <article v-for="(item,index) in products" :key="item.id" :class="{ wide: index % 5 === 0 }">
          <NuxtLink class="image" :to="`/produto/${item.slug}`"><img v-if="image(item)" :src="image(item)!"
                                                                     :alt="item.name" loading="lazy">
            <div v-else class="placeholder">{{ item.name.charAt(0) }}</div>
          </NuxtLink>
          <div class="meta">
            <div><small>{{ item.categories?.[0]?.name || 'Coleção' }}</small>
              <NuxtLink :to="`/produto/${item.slug}`"><h2>{{ item.name }}</h2></NuxtLink>
            </div>
            <strong>{{ money(item.price) }}</strong></div>
        </article>
        <div v-if="!products.length" class="empty">Nenhuma peça disponível nesta seleção.</div>
      </section>
    </main>
    <footer><strong>{{ storefront.site.name }}</strong><span>Curadoria e comércio digital por Elinea</span></footer>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box
}

:global(body) {
  margin: 0
}

.editorial-inner {
  --ink: #111317;
  --blue: #265bff;
  min-height: 100dvh;
  background: #f1f2f3;
  color: var(--ink);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif
}

header {
  height: 78px;
  display: grid;
  grid-template-columns:1fr auto 1fr;
  align-items: center;
  padding: 0 34px;
  border-bottom: 1px solid var(--ink)
}

.logo {
  color: var(--ink);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -.04em;
  text-decoration: none
}

nav {
  display: flex;
  gap: 32px
}

nav a, .bag {
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none
}

.bag {
  justify-self: end
}

.heading {
  display: grid;
  grid-template-columns:180px 1fr;
  max-width: 1500px;
  margin: auto;
  padding: 88px 34px 80px
}

.heading span {
  padding-top: 12px;
  color: #555b62;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase
}

.heading h1 {
  max-width: 1000px;
  margin: 0;
  font-size: clamp(58px, 8vw, 122px);
  font-weight: 500;
  line-height: .86;
  letter-spacing: -.075em
}

.grid {
  display: grid;
  grid-template-columns:repeat(12, 1fr);
  gap: 90px 20px;
  max-width: 1500px;
  margin: auto;
  padding: 0 34px 130px
}

.grid article {
  grid-column: span 3
}

.grid article:nth-child(3n+2) {
  margin-top: 110px
}

.grid article.wide {
  grid-column: span 5;
  margin-top: 0
}

.image {
  display: block;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: #d8dce0
}

.image img, .photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.85);
  transition: transform .55s, filter .3s
}

.image:hover img {
  filter: saturate(1);
  transform: scale(1.015)
}

.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 350px;
  background: linear-gradient(145deg, #cbd0d6, #919aa4);
  color: #fff;
  font-size: clamp(100px, 14vw, 210px);
  font-weight: 700;
  opacity: .75
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 15px
}

.meta small {
  color: #626870;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .1em
}

.meta a {
  color: var(--ink);
  text-decoration: none
}

.meta h2 {
  margin: 5px 0 0;
  font-size: 14px
}

.meta strong {
  padding-top: 17px;
  font-size: 13px;
  white-space: nowrap
}

.categories {
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  max-width: 1500px;
  margin: auto;
  padding: 0 34px 130px
}

.categories a {
  min-height: 300px;
  padding: 28px 0;
  border-top: 1px solid var(--ink);
  color: var(--ink);
  text-decoration: none
}

.categories a:nth-child(odd) {
  padding-right: 42px;
  border-right: 1px solid var(--ink)
}

.categories a:nth-child(even) {
  padding-left: 42px
}

.categories small {
  color: var(--blue);
  font-weight: 800
}

.categories h2 {
  margin: 80px 0 15px;
  font-size: clamp(34px, 4vw, 60px);
  font-weight: 500;
  letter-spacing: -.055em
}

.categories p {
  max-width: 42ch;
  color: #5d636a;
  line-height: 1.6
}

.detail {
  display: grid;
  grid-template-columns:minmax(350px, .78fr) minmax(0, 1.22fr);
  gap: 7vw;
  max-width: 1500px;
  margin: auto;
  padding: 65px 34px 110px
}

.copy {
  align-self: center
}

.back {
  display: inline-block;
  margin-bottom: 80px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 800
}

.copy > p:first-of-type {
  color: #5d636a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase
}

.copy h1 {
  margin: 16px 0 30px;
  font-size: clamp(58px, 6.4vw, 100px);
  font-weight: 500;
  line-height: .88;
  letter-spacing: -.075em
}

.price {
  display: flex;
  gap: 16px;
  font-size: 20px;
  font-weight: 800
}

.price s {
  color: #777e85;
  font-size: 14px
}

.description {
  max-width: 52ch;
  margin: 38px 0;
  color: #535a62;
  line-height: 1.7
}

.copy button, .cart-empty a {
  padding: 15px 0;
  border: 0;
  border-bottom: 1px solid var(--ink);
  background: none;
  color: var(--ink);
  font-weight: 800;
  text-decoration: none
}

.copy button:disabled {
  cursor: not-allowed;
  opacity: .62
}

.copy small {
  display: block;
  margin-top: 18px;
  color: #686f77
}

.photo {
  min-height: 720px;
  overflow: hidden;
  background: #d8dce0
}

.cart-empty {
  display: grid;
  align-content: center;
  min-height: 680px;
  padding: 70px 34px
}

.cart-empty > span {
  color: #5d636a;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .14em
}

.cart-empty h1 {
  margin: 18px 0 30px;
  font-size: clamp(70px, 10vw, 150px);
  font-weight: 500;
  line-height: .8;
  letter-spacing: -.08em
}

.cart-empty em {
  color: var(--blue);
  line-height: 1.1
}

.cart-empty p {
  color: #5d636a
}

.cart-empty a {
  justify-self: start;
  margin-top: 20px
}

.empty {
  grid-column: 1/-1;
  padding: 80px 0;
  border-top: 1px solid #92989f;
  color: #5d636a
}

footer {
  display: flex;
  justify-content: space-between;
  padding: 36px 34px;
  border-top: 1px solid var(--ink);
  font-size: 12px
}

footer span {
  color: #595f66
}

@media (max-width: 900px) {
  header {
    grid-template-columns:1fr auto
  }

  nav {
    display: none
  }

  .heading {
    grid-template-columns:1fr;
    gap: 18px
  }

  .grid article, .grid article.wide {
    grid-column: span 6;
    margin-top: 0
  }

  .detail {
    grid-template-columns:1fr
  }

  .photo {
    min-height: 560px;
    grid-row: 1
  }

  .copy {
    grid-row: 2
  }

  .back {
    margin-bottom: 35px
  }
}

@media (max-width: 560px) {
  header, .heading, .grid, .categories, .detail, .cart-empty {
    padding-left: 18px;
    padding-right: 18px
  }

  .heading {
    padding-top: 60px;
    padding-bottom: 55px
  }

  .grid {
    gap: 55px 10px
  }

  .categories {
    grid-template-columns:1fr
  }

  .categories a:nth-child(n) {
    padding-left: 0;
    padding-right: 0;
    border-right: 0
  }

  .detail {
    padding-top: 24px
  }

  .photo {
    min-height: 450px
  }

  .copy h1 {
    font-size: 58px
  }

  .cart-empty h1 {
    font-size: 72px
  }

  footer {
    gap: 22px;
    flex-direction: column;
    padding: 28px 18px
  }
}

@media (prefers-reduced-motion: reduce) {
  .image img {
    transition: none
  }
}
</style>
