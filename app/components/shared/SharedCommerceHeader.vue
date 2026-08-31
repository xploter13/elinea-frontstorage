<script setup lang="ts">
import { LockKeyhole } from '@lucide/vue'
defineProps<{ storeName: string, step?: string }>()
</script>

<template>
  <header class="shared-header">
    <NuxtLink to="/" class="shared-brand">{{ storeName }}</NuxtLink>
    <span v-if="step" class="shared-step">{{ step }}</span>
    <span class="shared-secure"><LockKeyhole :size="15" /> Ambiente seguro</span>
  </header>
</template>

<style scoped>
.shared-header{height:72px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 clamp(18px,4vw,56px);border-bottom:1px solid #dce4e1;background:#fff;color:#163b36;font-family:"Segoe UI",Arial,sans-serif}.shared-brand{color:inherit;font-family:"Trebuchet MS",sans-serif;font-size:20px;font-weight:800;letter-spacing:-.04em;text-decoration:none}.shared-step{font-size:12px;font-weight:700;color:#59706d}.shared-secure{justify-self:end;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:#177c68}@media(max-width:640px){.shared-header{grid-template-columns:1fr auto}.shared-step{display:none}.shared-secure{font-size:0}.shared-secure svg{width:18px;height:18px}}
</style>
