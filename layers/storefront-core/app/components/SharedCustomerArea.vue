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
:global(*){box-sizing:border-box}.account-shell{min-height:100dvh;background:radial-gradient(circle at 8% 4%,rgba(255,214,179,.28),transparent 28rem),radial-gradient(circle at 92% 10%,rgba(31,107,79,.14),transparent 26rem),#f7f6f1;color:#173c37;font-family:"Aptos","Segoe UI",Arial,sans-serif}.account-layout{display:grid;grid-template-columns:286px minmax(0,820px);gap:clamp(42px,7vw,104px);max-width:1260px;margin:auto;padding:62px clamp(18px,4vw,56px) 104px}.account-nav{align-self:start;position:sticky;top:102px;padding:18px;border:1px solid rgba(21,59,54,.09);border-radius:18px;background:rgba(255,255,255,.78);box-shadow:0 22px 62px rgba(30,70,62,.08);backdrop-filter:blur(14px)}.shop-link{display:flex;align-items:center;gap:8px;margin-bottom:22px;color:#59706c;font-size:12px;font-weight:850;text-decoration:none}.shop-link:hover{color:#177c68}.avatar{display:flex;align-items:center;gap:12px;padding:18px;border-radius:14px;background:#e9f5f1;color:#177c68}.avatar span{display:grid;gap:3px}.avatar small{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#708480}.avatar strong{color:#173c37}.account-nav nav{display:grid;gap:5px;padding-top:16px}.account-nav nav a{display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:11px;color:#5c716e;font-size:13px;font-weight:850;text-decoration:none;transition:background .2s,color .2s,transform .2s}.account-nav nav a:hover{background:#f2f7f5;color:#177c68;transform:translateX(2px)}.account-nav nav a.active{background:#dff2ec;color:#126d5d}.account-heading{padding:36px;border:1px solid rgba(21,59,54,.09);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.9),rgba(229,244,239,.64));box-shadow:0 24px 70px rgba(30,70,62,.08)}.account-heading>span,.welcome-card span{font:900 11px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#177c68}.account-heading h1{margin:10px 0 12px;font-family:"Aptos","Segoe UI",Arial,sans-serif;font-size:clamp(42px,5.8vw,72px);font-weight:950;line-height:.94;letter-spacing:-.052em;text-wrap:balance}.account-heading p{margin:0;color:#667d79}.welcome-card{display:flex;justify-content:space-between;gap:30px;margin-top:22px;padding:32px;border:1px solid rgba(21,59,54,.08);border-radius:16px;background:radial-gradient(circle at 90% 10%,rgba(255,209,164,.45),transparent 14rem),#dff2ec;color:#177c68;box-shadow:0 20px 52px rgba(30,70,62,.08)}.welcome-card h2{max-width:470px;margin:9px 0;font-family:"Aptos","Segoe UI",Arial,sans-serif;font-size:30px;font-weight:950;line-height:1.04;letter-spacing:-.035em;color:#173c37}.welcome-card p{margin:0;color:#57726d;font-size:13px}.login-form,.profile-form{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;padding:30px;border:1px solid rgba(21,59,54,.09);border-radius:16px;background:rgba(255,255,255,.86);box-shadow:0 18px 46px rgba(30,70,62,.06)}.login-form label,.profile-form label{display:grid;gap:8px;color:#435d59;font-size:12px;font-weight:850}.login-form input,.profile-form input{height:52px;padding:0 15px;border:1px solid #ccd8d5;border-radius:11px;background:#fff;color:#173c37;font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}.login-form input:focus,.profile-form input:focus{border-color:#177c68;box-shadow:0 0 0 4px #dff3ec}.login-form button,.profile-form button,.empty-state button{display:flex;height:52px;align-items:center;justify-content:center;gap:8px;border:0;border-radius:11px;background:#173c37;color:#fff;font-weight:900}.text-button{background:transparent!important;color:#177c68!important}.feedback{padding:13px 16px;border-radius:10px;background:#fff3d9;color:#765b1a;font-size:12px}.empty-state{display:grid;justify-items:start;margin-top:22px;padding:56px;border:1px solid rgba(21,59,54,.09);border-radius:18px;background:rgba(255,255,255,.86);box-shadow:0 22px 62px rgba(30,70,62,.08)}.state-icon{display:grid;width:60px;height:60px;place-items:center;border-radius:16px 16px 16px 5px;background:#dff2ec;color:#177c68}.empty-state h2{margin:25px 0 10px;font-family:"Aptos","Segoe UI",Arial,sans-serif;font-size:33px;font-weight:950;letter-spacing:-.04em}.empty-state p{max-width:500px;margin:0 0 26px;color:#667b78;line-height:1.65}.empty-state a{display:flex;align-items:center;gap:6px;color:#177c68;font-size:13px;font-weight:900;text-decoration:none}.empty-state button{padding:0 20px;opacity:.62}.empty-state small,.profile-form>small{margin-top:10px;color:#758783}.profile-form{grid-template-columns:1fr}.profile-form .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}.profile-form input:disabled{background:#f5f7f6;color:#81918e}.profile-form button{margin-top:8px;opacity:.62}@media(max-width:780px){.account-layout{grid-template-columns:1fr;padding-top:30px}.account-nav{position:static;display:grid}.avatar{display:none}.account-nav nav{display:flex;overflow:auto;padding-bottom:5px}.account-nav nav a{white-space:nowrap}.shop-link{margin-bottom:12px}.account-heading h1{font-size:48px}}@media(max-width:560px){.account-heading{padding:26px 18px}.login-form{grid-template-columns:1fr;padding:20px}.profile-form .field-row{grid-template-columns:1fr}.welcome-card{padding:23px}.welcome-card>svg{display:none}.empty-state{padding:30px 22px}}
</style>
