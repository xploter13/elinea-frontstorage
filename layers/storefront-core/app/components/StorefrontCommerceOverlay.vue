<script setup lang="ts">
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from '@lucide/vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import { useStorefrontCatalog } from '../composables/useStorefrontCatalog'
import { useStorefrontCommerce } from '../composables/useStorefrontCommerce'

const props = defineProps<{ storefront: StorefrontPayload }>()
const {
  money,
  productImage,
} = useStorefrontCatalog(props.storefront)
const {
  cart, cartProducts, wishlistProducts, cartOpen, wishlistOpen, busyProducts, notice,
  initialize, addToCart, updateQuantity, removeFromCart, toggleWishlist,
} = useStorefrontCommerce(props.storefront)

onMounted(initialize)
</script>

<template>
  <div class="drawer drawer-end pointer-events-none fixed inset-0 z-[90]" :class="{ 'drawer-open pointer-events-auto': cartOpen }">
    <input class="drawer-toggle" type="checkbox" :checked="cartOpen" aria-label="Abrir cesta">
    <div class="drawer-side">
      <button class="drawer-overlay" aria-label="Fechar cesta" @click="cartOpen=false"></button>
      <aside class="menu min-h-full w-[min(92vw,440px)] bg-base-100 p-0 text-base-content shadow-2xl">
        <header class="flex items-start justify-between border-b border-base-300 p-6">
          <div><span class="badge badge-primary badge-outline mb-2">Sua cesta</span><h2 class="m-0 text-3xl font-bold">{{ cart.totals.items_count }} {{ cart.totals.items_count === 1 ? 'item' : 'itens' }}</h2></div>
          <button class="btn btn-circle btn-ghost btn-sm" type="button" aria-label="Fechar cesta" @click="cartOpen=false"><X :size="19"/></button>
        </header>

        <div v-if="cartProducts.length" class="flex-1 overflow-y-auto p-4">
          <article v-for="entry in cartProducts" :key="entry.item.id" class="card card-side mb-3 border border-base-300 bg-base-100 shadow-sm">
            <figure class="m-3 h-24 w-24 shrink-0 rounded-box bg-base-200">
              <img v-if="entry.product && productImage(entry.product)" :src="productImage(entry.product)!" :alt="entry.item.name" class="h-full w-full object-contain">
              <ShoppingBag v-else :size="25" class="opacity-35"/>
            </figure>
            <div class="card-body min-w-0 gap-2 p-4 pl-1">
              <h3 class="line-clamp-2 text-sm font-bold leading-snug">{{ entry.item.name }}</h3>
              <strong class="text-primary">{{ money(entry.item.total) }}</strong>
              <div class="card-actions items-center justify-between">
                <div class="join">
                  <button class="btn btn-sm join-item" type="button" aria-label="Diminuir quantidade" :disabled="busyProducts.includes(entry.item.product_id)" @click="updateQuantity(entry.item.product_id,entry.item.quantity-1)"><Minus :size="14"/></button>
                  <span class="btn btn-sm join-item pointer-events-none min-w-10">{{ entry.item.quantity }}</span>
                  <button class="btn btn-sm join-item" type="button" aria-label="Aumentar quantidade" :disabled="busyProducts.includes(entry.item.product_id)" @click="updateQuantity(entry.item.product_id,entry.item.quantity+1)"><Plus :size="14"/></button>
                </div>
                <button class="btn btn-circle btn-ghost btn-sm text-error" type="button" aria-label="Remover produto" @click="removeFromCart(entry.item.product_id)"><Trash2 :size="16"/></button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="grid flex-1 place-items-center px-8 text-center">
          <div><span class="mx-auto grid size-20 place-items-center rounded-full bg-primary/10 text-primary"><ShoppingBag :size="31"/></span><h3 class="mt-5 text-2xl font-bold">Sua cesta está vazia.</h3><p class="mt-2 text-sm opacity-60">Adicione produtos sem precisar criar uma conta.</p><button class="btn btn-primary mt-5" @click="cartOpen=false">Continuar comprando</button></div>
        </div>

        <footer v-if="cartProducts.length" class="border-t border-base-300 bg-base-200/60 p-6">
          <div class="mb-4 flex items-end justify-between"><span class="text-sm opacity-60">Subtotal</span><strong class="text-2xl">{{ money(cart.totals.total) }}</strong></div>
          <NuxtLink to="/carrinho" class="btn btn-primary btn-block" @click="cartOpen=false">Revisar cesta</NuxtLink>
          <p class="mt-3 text-center text-xs opacity-55">Frete calculado antes do pagamento.</p>
        </footer>
      </aside>
    </div>
  </div>

  <dialog v-if="wishlistOpen" class="modal modal-open">
    <div class="modal-box max-w-3xl border border-base-300">
      <form method="dialog"><button class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3" aria-label="Fechar lista" @click="wishlistOpen=false"><X :size="18"/></button></form>
      <span class="badge badge-secondary badge-outline"><Heart :size="13"/> Lista de desejos</span>
      <h2 class="mt-3 text-3xl font-bold">Produtos salvos</h2>
      <div v-if="wishlistProducts.length" class="mt-6 grid gap-3 sm:grid-cols-2">
        <article v-for="product in wishlistProducts" :key="product.id" class="card card-side border border-base-300 bg-base-100">
          <figure class="m-3 size-24 shrink-0 rounded-box bg-base-200"><img v-if="productImage(product)" :src="productImage(product)!" :alt="product.name" class="size-full object-contain"><ShoppingBag v-else :size="25" class="opacity-35"/></figure>
          <div class="card-body min-w-0 gap-2 p-4 pl-1"><NuxtLink :to="`/produto/${product.slug}`" class="line-clamp-2 text-sm font-bold" @click="wishlistOpen=false">{{ product.name }}</NuxtLink><strong class="text-primary">{{ money(product.price) }}</strong><div class="card-actions mt-auto"><button class="btn btn-primary btn-sm" :disabled="product.stock<1 || busyProducts.includes(product.id)" @click="addToCart(product)">Adicionar</button><button class="btn btn-ghost btn-sm text-error" @click="toggleWishlist(product)">Remover</button></div></div>
        </article>
      </div>
      <div v-else class="alert mt-6"><Heart :size="20"/><span>Sua lista ainda está vazia. Use o coração nos produtos para guardar seus favoritos.</span></div>
    </div>
    <form method="dialog" class="modal-backdrop"><button aria-label="Fechar lista" @click="wishlistOpen=false">fechar</button></form>
  </dialog>

  <div v-if="notice" class="toast toast-end toast-bottom z-[110]">
    <div class="alert shadow-xl" :class="notice.type === 'success' ? 'alert-success' : 'alert-error'"><span>{{ notice.message }}</span></div>
  </div>
</template>
