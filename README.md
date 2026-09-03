# Elínea Storefront

Aplicação Nuxt 4 SSR destinada a uma única loja Elínea. Cada cliente possui uma
cópia e um deploy independentes deste repositório.

## Configuração

```powershell
Copy-Item .env.example .env
yarn install
npm run dev
```

Configure:

```env
NUXT_API_BASE=http://elinea-api.test/api/v1
NUXT_ELINEA_STORE_KEY=
NUXT_ELINEA_STORE_SECRET=
NUXT_ELINEA_STORE_SITE=default
```

- `NUXT_ELINEA_STORE_KEY` e `NUXT_ELINEA_STORE_SECRET` identificam a loja no
  servidor Nitro. O segredo nunca é exposto no bundle client-side.
- `NUXT_ELINEA_STORE_SITE` é somente um fallback para desenvolvimento local sem
  credenciais e não é aceito em produção.

O storefront renderiza `app/components/BaseTemplate.vue` diretamente.
Não existem registry, seleção dinâmica ou cópia de templates dentro da aplicação.
Branding específico fica em `app/components/base.config.ts` e nos assets;
engenharia compartilhada pertence a `@elinea/sdk` e `@elinea/ui`.

## SSR

As páginas em `app/pages/` usam `useStorefrontPage`, que executa `useFetch('/api/storefront')`
durante SSR. A rota Nitro cria o SDK com o runtime config privado, consulta a API e
entrega HTML completo antes da hidratação.

```powershell
npm run typecheck
npm run build
```

Consulte `docs/context.md` e `docs/package-architecture.md` para os limites de cada
camada.
