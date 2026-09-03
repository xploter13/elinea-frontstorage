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

## Área do cliente separada

As rotas `/carrinho` e `/checkout` são encaminhadas pelo Nitro para o
projeto `C:\htdocs\elinea-customer`. Em desenvolvimento, mantenha esse app
rodando na porta `3101`. Em produção, configure `NUXT_CUSTOMER_APP_URL` com a
URL interna do serviço do customer app antes do build do storefront. As rotas
`/api/*` continuam no host principal, permitindo que autenticação e carrinho
compartilhem o mesmo cookie e a mesma sessão.

A rota `/conta` permanece no storefront principal, usando o header, footer e a
identidade visual completos da loja.

A sessão de visitante do carrinho usa o cookie `elinea_cart_session`, permitindo
que o carrinho seja preservado ao encaminhar o usuário para o app customer em
outra porta ou serviço. O `localStorage` antigo permanece apenas como fallback de
migração.

Consulte `docs/context.md` e `docs/package-architecture.md` para os limites de cada
camada.
