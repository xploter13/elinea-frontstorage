<script setup lang="ts">
import { ArrowRight, BadgeCheck, PackageSearch, Sparkles } from '@lucide/vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import { useStorefrontCatalog } from '~~/layers/storefront-core/app/composables/useStorefrontCatalog'

const props = defineProps<{ storefront: StorefrontPayload }>()
const { productImage, money } = useStorefrontCatalog(props.storefront)
const products = computed(() => props.storefront.products.slice(0, 3))
</script>

<template>
  <section class="editorial-spotlight">
    <div class="story">
      <span class="kicker">curadoria da loja</span>
      <h2>Uma vitrine com ritmo de compra, nao de prateleira.</h2>
      <p>Produtos em destaque, categorias claras e compra rapida para transformar o template base em uma experiencia de ecommerce mais madura.</p>
      <NuxtLink to="/produtos">Explorar vitrine <ArrowRight :size="17" /></NuxtLink>
    </div>

    <div class="showcase" aria-label="Produtos em destaque">
      <article v-for="(product, index) in products" :key="product.id" :class="`item item-${index + 1}`">
        <span>{{ product.categories[0]?.name || 'Selecao' }}</span>
        <img
          v-if="productImage(product)"
          :src="productImage(product)!"
          :alt="product.name"
          loading="lazy"
        >
        <PackageSearch v-else :size="42" />
        <strong>{{ product.name }}</strong>
        <small>{{ money(product.price) }}</small>
      </article>
      <div class="quality-note">
        <BadgeCheck :size="20" />
        <span>Produtos organizados para decisao rapida</span>
      </div>
      <Sparkles class="spark" :size="42" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.editorial-spotlight {
  display: grid;
  grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr);
  gap: clamp(28px, 5vw, 72px);
  width: min(100% - 40px, 1400px);
  margin: 72px auto 0;
  align-items: center;
  padding: clamp(30px, 5vw, 64px);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, .96), rgba(37, 99, 235, .82)),
    radial-gradient(circle at 80% 10%, rgba(255, 209, 164, .28), transparent 38%);
  color: #fff;
  overflow: hidden;
}

.story {
  position: relative;
  z-index: 1;
}

.kicker {
  color: #dbeafe;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.story h2 {
  max-width: 620px;
  margin: 15px 0 18px;
  font-size: clamp(34px, 4.5vw, 64px);
  line-height: .96;
  letter-spacing: -.04em;
  text-wrap: balance;
}

.story p {
  max-width: 54ch;
  margin: 0;
  color: rgba(255, 255, 255, .74);
  font-size: 15px;
  line-height: 1.7;
}

.story a {
  display: inline-flex;
  height: 46px;
  align-items: center;
  gap: 9px;
  margin-top: 28px;
  padding: 0 18px;
  border-radius: 8px;
  background: #fff;
  color: var(--sf-ink);
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
}

.showcase {
  position: relative;
  display: grid;
  min-height: 390px;
}

.item {
  position: absolute;
  display: grid;
  width: min(235px, 44%);
  gap: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, .32);
  border-radius: 14px;
  background: rgba(255, 255, 255, .9);
  color: var(--sf-ink);
  box-shadow: 0 22px 50px rgba(0, 0, 0, .18);
}

.item img,
.item svg {
  width: 100%;
  height: 150px;
  object-fit: contain;
  color: var(--sf-primary);
}

.item span {
  color: var(--sf-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.item strong {
  min-height: 38px;
  font-size: 14px;
  line-height: 1.35;
}

.item small {
  color: var(--sf-primary);
  font-size: 18px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}

.item-1 {
  left: 2%;
  top: 16%;
  transform: rotate(-4deg);
}

.item-2 {
  left: 32%;
  top: 3%;
  z-index: 2;
  transform: rotate(2deg);
}

.item-3 {
  right: 2%;
  bottom: 4%;
  transform: rotate(-1deg);
}

.quality-note {
  position: absolute;
  left: 8%;
  bottom: 7%;
  display: flex;
  max-width: 250px;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, .13);
  color: rgba(255, 255, 255, .9);
  font-size: 12px;
  font-weight: 800;
}

.spark {
  position: absolute;
  right: 8%;
  top: 10%;
  color: #ffd1a4;
}

@media (max-width: 900px) {
  .editorial-spotlight {
    grid-template-columns: 1fr;
  }

  .showcase {
    min-height: 430px;
  }
}

@media (max-width: 620px) {
  .editorial-spotlight {
    width: min(100% - 24px, 1400px);
    padding: 28px 18px;
  }

  .showcase {
    min-height: auto;
    gap: 12px;
  }

  .item,
  .quality-note,
  .spark {
    position: static;
    width: 100%;
    transform: none;
  }

  .item img,
  .item svg {
    height: 120px;
  }
}
</style>
