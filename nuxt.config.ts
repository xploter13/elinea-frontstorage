import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    apiBase: 'http://elinea-api.test/api/v1',
    storefrontSite: 'default',
    elineaStoreKey: '',
    elineaStoreSecret: '',
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true, typeCheck: true },
})
