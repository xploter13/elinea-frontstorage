# Elinea Frontstorage

Storefront Nuxt multi-tenant da Elinea. O domínio da requisição identifica a loja e o
campo `site.template.folder` (com fallback para `template.slug`) seleciona o renderer.
Essas duas etapas são independentes: `NUXT_STOREFRONT_SITE=default` apenas resolve
o `Site` de slug/domínio `default`; se esse site estiver associado ao template
`pharmacy`, o renderer carregado será `pharmacy`.

## MVP

O endpoint interno `GET /api/storefront` consulta a API Laravel com o header `X-Site`
e agrega os dados públicos necessários:

- `GET /api/v1/site`
- `GET /api/v1/products`
- `GET /api/v1/categories`
- `GET /api/v1/integrations/analytics`
- `GET /api/v1/newsletter-popup`

Em `localhost`, `NUXT_STOREFRONT_SITE` define o tenant usado no desenvolvimento,
não o layout. Para testar outro layout, altere na API a associação
`sites.template_id -> templates.folder` do site resolvido.

```bash
copy .env.example .env
npm run dev
```

Variáveis:

- `NUXT_API_BASE`: URL base da API, apenas no servidor Nuxt.
- `NUXT_STOREFRONT_SITE`: domínio ou slug usado como fallback local.

## Adicionando templates

Crie o componente em `app/components/templates` e registre-o em
`app/pages/[...path].vue` usando exatamente o valor de `template.folder` (ou slug).
Novos renderers são criados a partir do template base:

```bash
npm run template:create -- farmacia-sao-lucas
```

O registro é automático pela pasta em `app/components/templates`. Cada renderer
recebe `storefront` com site, produtos, categorias e integrações públicas; identidade
visual, textos institucionais e assets ficam no código versionado do cliente.
