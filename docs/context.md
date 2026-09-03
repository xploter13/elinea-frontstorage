# Contexto do Elínea Storefront

Este projeto é uma aplicação Nuxt 4 SSR para uma única loja. A API continua
multi-tenant, mas o storefront não alterna tenant ou renderer durante uma requisição.

## Fluxo

```text
Domínio do cliente
        ↓
Nuxt 4 / Nitro SSR
        ↓
@elinea/sdk + credenciais privadas do .env
        ↓
Elínea API resolve store → site → tenant
        ↓
HTML completo + payload de hidratação
```

O browser chama apenas rotas internas do Nitro. `X-Store-Secret`, caminhos da API e
identificadores de tenant não chegam ao bundle público.

## Pacotes

- `@elinea/sdk`: TypeScript puro, HTTP, contratos, mappers e erros da Elínea API.
- `@elinea/ui`: Vue, tokens e componentes reutilizáveis baseados no design aprovado.
- storefront: SSR, runtimeConfig, rotas, SEO, branding, assets e composição da loja.

As dependências `file:../elinea-sdk` e `file:../elinea-ui` são transitórias até a
publicação dos pacotes em registry com versões semânticas.

## Estrutura

```text
app/
├── assets/
├── components/
│   ├── shared/
│   ├── BaseTemplate.vue
│   ├── Base*.vue
│   └── base.config.ts
├── pages/
└── utils/
server/
├── api/
└── utils/elinea.ts
shared/types/
```

`BaseTemplate.vue` é importado diretamente pela página catch-all. Checkout e conta
continuam compartilhados, mas não há seleção por `template.folder`, registry,
fallback visual ou scaffold de renderers.

## Ambiente

```env
NUXT_API_BASE=http://elinea-api.test/api/v1
NUXT_ELINEA_STORE_KEY=
NUXT_ELINEA_STORE_SECRET=
NUXT_ELINEA_STORE_SITE=default
```

Produção exige key e secret. O fallback `NUXT_ELINEA_STORE_SITE` existe somente para
desenvolvimento local enquanto credenciais dos sites existentes são rotacionadas.
Host, query string e headers enviados pelo navegador não trocam a loja configurada.

## Dados e estado

`GET /api/storefront` agrega site, produtos, categorias, analytics e newsletter pelo
SDK. As rotas `/api/cart` mantêm `X-Cart-Session` e usam o mesmo cliente server-side.
Wishlist ainda fica no `localStorage`, isolada por `site.slug`.

O layer `layers/storefront-core` é transitório. Ele contém estado Nuxt e adapters dos
contratos snake_case antigos até a migração completa para `@elinea/ui`.

## Branding

A aparência inicial segue o antigo template base aprovado. Cores, tipografia e
conteúdo padrão estão em `app/components/base.config.ts`; imagens ficam em
`app/assets` ou `public`. Estruturas reutilizáveis devem evoluir em `@elinea/ui`.

## Validação

```powershell
npm run typecheck
npm run build
```

Também valide HTML SSR, hidratação, catálogo, produto, categorias, carrinho, checkout,
conta, responsividade e ausência de `NUXT_ELINEA_STORE_SECRET` em `.output/public`.
