<script setup lang="ts">
import { ArrowRight, ChevronRight, CircleUserRound, House, LogIn, MapPin, Package, UserRound } from '@lucide/vue'
import type { StorefrontPayload } from '#shared/types/storefront'
import type { StorefrontPage } from '~/utils/storefront-page'
import SharedCommerceHeader from './SharedCommerceHeader.vue'

const props = defineProps<{ storefront: StorefrontPayload, page: StorefrontPage }>()
const section = computed(() => props.page.kind === 'account' ? props.page.section : 'overview')
const title = computed(() => ({ overview: 'Sua conta, em um só lugar.', orders: 'Meus pedidos', addresses: 'Meus endereços', profile: 'Meus dados' })[section.value])
const submitted = ref(false)
</script>

<template>
  <div class="account-shell">
    <SharedCommerceHeader :store-name="storefront.site.name" />
    <main class="account-layout">
      <aside class="account-nav">
        <NuxtLink to="/" class="shop-link"><House :size="17"/> Voltar à loja</NuxtLink>
        <div class="avatar"><CircleUserRound :size="28"/><span><small>Área do cliente</small><strong>Bem-vindo</strong></span></div>
        <nav aria-label="Menu da conta">
          <NuxtLink to="/conta" :class="{active:section==='overview'}"><UserRound :size="18"/>Visão geral</NuxtLink>
          <NuxtLink to="/conta/pedidos" :class="{active:section==='orders'}"><Package :size="18"/>Meus pedidos</NuxtLink>
          <NuxtLink to="/conta/enderecos" :class="{active:section==='addresses'}"><MapPin :size="18"/>Endereços</NuxtLink>
          <NuxtLink to="/conta/dados" :class="{active:section==='profile'}"><CircleUserRound :size="18"/>Meus dados</NuxtLink>
        </nav>
      </aside>

      <section class="account-content">
        <div class="account-heading"><span>Área do cliente</span><h1>{{ title }}</h1><p>Acompanhe compras e mantenha seus dados atualizados.</p></div>

        <template v-if="section === 'overview'">
          <div class="welcome-card"><div><span>Comece por aqui</span><h2>Entre para acompanhar seus pedidos.</h2><p>Use o mesmo e-mail informado nas suas compras.</p></div><LogIn :size="42"/></div>
          <form class="login-form" @submit.prevent="submitted=true"><label>E-mail<input type="email" autocomplete="email" placeholder="voce@email.com" required></label><label>Senha<input type="password" autocomplete="current-password" placeholder="Sua senha" required></label><button type="submit">Entrar <ArrowRight :size="17"/></button><button type="button" class="text-button">Esqueci minha senha</button></form>
          <p v-if="submitted" class="feedback">O acesso será habilitado com a integração de autenticação.</p>
        </template>

        <div v-else-if="section === 'orders'" class="empty-state"><div class="state-icon"><Package :size="28"/></div><h2>Nenhum pedido por aqui.</h2><p>Quando você fizer uma compra, os detalhes e o rastreamento aparecerão nesta página.</p><NuxtLink to="/produtos">Explorar produtos <ChevronRight :size="17"/></NuxtLink></div>
        <div v-else-if="section === 'addresses'" class="empty-state"><div class="state-icon"><MapPin :size="28"/></div><h2>Você ainda não salvou endereços.</h2><p>Salve seus locais de entrega para finalizar as próximas compras mais rápido.</p><button type="button" disabled>Adicionar endereço</button><small>Disponível após entrar na sua conta.</small></div>
        <form v-else class="profile-form" @submit.prevent><div class="field-row"><label>Nome<input autocomplete="given-name" placeholder="Seu nome" disabled></label><label>Sobrenome<input autocomplete="family-name" placeholder="Seu sobrenome" disabled></label></div><label>E-mail<input type="email" autocomplete="email" placeholder="voce@email.com" disabled></label><label>Telefone<input type="tel" autocomplete="tel" placeholder="(00) 00000-0000" disabled></label><button type="submit" disabled>Salvar alterações</button><small>Entre na sua conta para editar os dados.</small></form>
      </section>
    </main>
  </div>
</template>

<style scoped>
:global(*){box-sizing:border-box}.account-shell{min-height:100dvh;background:#f4f7f6;color:#173c37;font-family:"Segoe UI",Arial,sans-serif}.account-layout{display:grid;grid-template-columns:260px minmax(0,760px);gap:clamp(50px,8vw,120px);max-width:1220px;margin:auto;padding:62px clamp(18px,4vw,56px) 100px}.account-nav{align-self:start}.shop-link{display:flex;align-items:center;gap:8px;margin-bottom:38px;color:#59706c;font-size:12px;font-weight:700;text-decoration:none}.avatar{display:flex;align-items:center;gap:12px;padding-bottom:24px;border-bottom:1px solid #d7e1de;color:#177c68}.avatar span{display:grid;gap:3px}.avatar small{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#708480}.avatar strong{color:#173c37}.account-nav nav{display:grid;padding-top:18px}.account-nav nav a{display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:9px;color:#5c716e;font-size:13px;font-weight:700;text-decoration:none}.account-nav nav a.active{background:#dff2ec;color:#126d5d}.account-heading>span,.welcome-card span{font:700 10px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#177c68}.account-heading h1{margin:10px 0 12px;font-family:"Trebuchet MS",sans-serif;font-size:clamp(42px,6vw,72px);line-height:.92;letter-spacing:-.06em}.account-heading p{margin:0;color:#667d79}.welcome-card{display:flex;justify-content:space-between;gap:30px;margin-top:46px;padding:30px;border-radius:14px;background:#dff2ec;color:#177c68}.welcome-card h2{max-width:470px;margin:9px 0;font-family:"Trebuchet MS",sans-serif;font-size:28px;line-height:1.05;color:#173c37}.welcome-card p{margin:0;color:#57726d;font-size:13px}.login-form,.profile-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px;padding:30px;border:1px solid #d7e0de;border-radius:14px;background:#fff}.login-form label,.profile-form label{display:grid;gap:7px;color:#435d59;font-size:12px;font-weight:700}.login-form input,.profile-form input{height:50px;padding:0 15px;border:1px solid #ccd8d5;border-radius:9px;background:#fff;color:#173c37;font:inherit}.login-form button,.profile-form button,.empty-state button{display:flex;height:50px;align-items:center;justify-content:center;gap:8px;border:0;border-radius:9px;background:#173c37;color:#fff;font-weight:800}.text-button{background:transparent!important;color:#177c68!important}.feedback{padding:13px 16px;border-radius:8px;background:#fff3d9;color:#765b1a;font-size:12px}.empty-state{display:grid;justify-items:start;margin-top:46px;padding:55px;border:1px solid #d7e0de;border-radius:14px;background:#fff}.state-icon{display:grid;width:58px;height:58px;place-items:center;border-radius:50%;background:#dff2ec;color:#177c68}.empty-state h2{margin:25px 0 10px;font-family:"Trebuchet MS",sans-serif;font-size:31px;letter-spacing:-.04em}.empty-state p{max-width:500px;margin:0 0 26px;color:#667b78;line-height:1.6}.empty-state a{display:flex;align-items:center;gap:6px;color:#177c68;font-size:13px;font-weight:800;text-decoration:none}.empty-state button{padding:0 20px;opacity:.6}.empty-state small,.profile-form>small{margin-top:10px;color:#758783}.profile-form{grid-template-columns:1fr}.profile-form .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}.profile-form input:disabled{background:#f5f7f6;color:#81918e}.profile-form button{margin-top:8px;opacity:.6}@media(max-width:780px){.account-layout{grid-template-columns:1fr;padding-top:30px}.account-nav{display:grid}.avatar{display:none}.account-nav nav{display:flex;overflow:auto;padding-bottom:5px}.account-nav nav a{white-space:nowrap}.shop-link{margin-bottom:12px}.account-heading h1{font-size:48px}}@media(max-width:560px){.login-form{grid-template-columns:1fr;padding:20px}.profile-form .field-row{grid-template-columns:1fr}.welcome-card{padding:23px}.welcome-card>svg{display:none}.empty-state{padding:30px 22px}}
</style>
