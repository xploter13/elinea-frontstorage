# Contexto do Elinea Frontstorage

Este documento é a referência de arquitetura e desenvolvimento do storefront da
Elinea. Deve ser atualizado sempre que o contrato com a API, a resolução de tenant
ou a estratégia de templates mudar.

A auditoria e o progresso da extração estão em `docs/package-architecture.md`.

## Objetivo

O `elinea-frontstorage` é uma aplicação Nuxt responsável por renderizar a loja
correta com base no domínio da requisição. Dados comerciais e identificação técnica
do template são fornecidos pela API `elinea-api`; a identidade visual fica no código
versionado do renderer.

O projeto não mantém uma lista própria de lojas. A API é a fonte da verdade para
tenants, produtos, categorias, integrações e demais dados do ecommerce.

## Arquitetura de pacotes

O storefront consome dois repositórios independentes:

- `@elinea/sdk`: cliente TypeScript sem dependências de Vue ou Nuxt, responsável por
  HTTP, autenticação, contratos, mapeamento de respostas e erros da Elínea API;
- `@elinea/ui`: biblioteca Vue de componentes, comportamento de ecommerce e tokens
  visuais reutilizáveis. Ela depende apenas dos contratos públicos do SDK.

A integração com Nuxt permanece neste projeto. `server/utils/elinea.ts` lê o
`runtimeConfig`, cria o cliente SDK no servidor e adapta temporariamente os modelos
normalizados aos contratos visuais legados. Os composables Nuxt continuam no
storefront até existir repetição comprovada entre lojas; não há `@elinea/nuxt`.

Durante esta migração, `package.json` referencia os dois pacotes por `file:../...`.
Esse vínculo é estritamente transitório para desenvolvimento local. Após a publicação,
cada storefront deve instalar versões semânticas independentes pelo registry.

## Fluxo multi-tenant

```text
Requisição no domínio da loja
        ↓
Nuxt identifica Host / X-Forwarded-Host
        ↓
Nuxt usa credenciais privadas de loja no servidor
        ↓
API resolve o tenant e isola os dados pelo site_id
        ↓
GET /api/v1/site informa site e template
        ↓
Nuxt seleciona o renderer por template.folder ou template.slug
```

Em produção, configure `NUXT_ELINEA_STORE_KEY` e `NUXT_ELINEA_STORE_SECRET`. O
segredo existe somente no runtime privado do Nitro e o SDK envia `X-Store-Key` e
`X-Store-Secret` do servidor para a API. O navegador nunca escolhe `tenant_id` nem
recebe o segredo.

O header `X-Site` ainda pode receber domínio ou slug durante a transição de lojas
sem credenciais. Em `localhost`, o fallback é `NUXT_STOREFRONT_SITE`. Esse mecanismo
legado deve ser removido depois que todas as lojas tiverem credenciais rotacionadas.

Esse valor resolve somente o `Site`. Ele não força o renderer. A seleção visual
continua vindo do template retornado pela API: `sites.template_id -> templates.folder`
(com fallback para `template.slug`). Exemplo: `NUXT_STOREFRONT_SITE=default` pode
renderizar `pharmacy` quando o site `default` estiver associado ao template Farmácia.

## API

URL padrão de desenvolvimento:

```text
http://elinea-api.test/api/v1
```

O endpoint interno `GET /api/storefront` agrega os seguintes endpoints públicos:

| Endpoint | Finalidade |
|---|---|
| `GET /site` | Resolve a loja atual e informa o template |
| `GET /products` | Lista os produtos públicos da loja |
| `GET /categories` | Lista as categorias públicas da loja |
| `GET /integrations/analytics` | Retorna GA4 e Facebook Pixel públicos |
| `GET /newsletter-popup` | Informa se o popup de newsletter está ativo |

Com credenciais configuradas, essas chamadas enviam do Nitro para a API:

```http
Accept: application/json
X-Store-Key: credencial-publica-da-loja
X-Store-Secret: credencial-privada-da-loja
```

As respostas Laravel usam o envelope padrão:

```json
{
  "data": {}
}
```

`GET /site` retorna um único objeto quando o tenant foi resolvido. A listagem de
lojas pertence a `GET /sites` e retorna um array em `data`.

### Carrinho visitante e lista de desejos

O navegador não chama a API Laravel diretamente. As rotas internas do Nuxt em
`/api/cart` usam `@elinea/sdk` para operar `/api/v1/cart`, preservando a credencial
de loja somente no servidor e encaminhando
`X-Cart-Session`. O identificador anônimo é criado uma única vez por loja e salvo
no `localStorage` com a chave `elinea:cart-session:{site}`. Assim, adicionar,
alterar quantidade e remover itens não dependem de login.

A lista de desejos também funciona para visitantes e fica no `localStorage`,
isolada por loja pela chave `elinea:wishlist:{site}`. Ela é deliberadamente local
até o módulo `Customer` expor um contrato público para sincronização. O estado
compartilhado dessas duas experiências ainda fica no layer transitório
`layers/storefront-core/app/composables/useStorefrontCommerce.ts`.

## Lojas conhecidas no MVP

| ID | Nome | Slug | Domínio | Template |
|---:|---|---|---|---|
| 1 | Loja principal | `default` | `default.elinea.com.br` | `default` |
| 2 | Supermercado Estrela | `supermercado-estrela` | `supermercado-estrela.elinea.com.br` | `default` |
| 3 | Supermercado Estrela | `supermercado-estrela-2` | `supermercado-estrela-2.elinea.com.br` | `default` |

Esses registros são apenas uma fotografia útil para desenvolvimento. O código não
deve depender dessa tabela, pois novos tenants podem ser cadastrados pela API.

## Resolução do domínio

A ordem atual de resolução no endpoint Nuxt é:

1. header `X-Site`, quando informado explicitamente;
2. primeiro valor de `X-Forwarded-Host`, quando existe proxy reverso;
3. header `Host` da requisição;
4. `NUXT_STOREFRONT_SITE` para `localhost`, `127.0.0.1` ou `::1`.

A porta é removida antes de encaminhar o domínio para a API. Portanto,
`supermercado-estrela.elinea.com.br:3000` é enviado como
`supermercado-estrela.elinea.com.br`.

## Seleção de templates

O endpoint `/site` inclui:

```json
{
  "template": {
    "id": 1,
    "name": "Template padrão",
    "slug": "default",
    "folder": "default",
    "segment": "general",
    "preview_image": null
  }
}
```

O frontend procura primeiro `template.folder` e depois `template.slug` no registro
automático em `app/templates/template-registry.ts`. Caso não exista renderer registrado,
`TemplateFallback.vue` mostra uma página de diagnóstico sem impedir a validação do
tenant e dos dados.

Um template futuro deve:

1. ser criado com `npm run template:create -- chave-do-cliente`;
2. receber uma prop `storefront` do tipo `StorefrontPayload`;
3. manter o componente `*Template.vue` diretamente na pasta do renderer;
4. usar o layer `storefront-core` para catálogo, carrinho e wishlist;
5. manter branding, conteúdo institucional e assets no arquivo estático do cliente.

Renderers disponíveis no MVP:

| Chave (`folder` ou `slug`) | Componente | Direção visual |
|---|---|---|
| `base` ou `default` | `base/BaseTemplate.vue` | Base replicável para novos clientes |
| `pharmacy` ou `farmacia` | `pharmacy/PharmacyTemplate.vue` | Farmácia flat, acessível e orientada a rotinas de cuidado |

### Páginas compartilhadas

Checkout e área do cliente não pertencem a um tema específico. A rota catch-all
renderiza os componentes de `app/components/shared` antes de consultar o registro
de templates, mantendo a mesma experiência em todos os segmentos:

| Rota | Componente compartilhado |
|---|---|
| `/checkout` | `SharedCheckout.vue` |
| `/conta` | `SharedCustomerArea.vue` |
| `/conta/pedidos` | `SharedCustomerArea.vue` |
| `/conta/enderecos` | `SharedCustomerArea.vue` |
| `/conta/dados` | `SharedCustomerArea.vue` |

O checkout compartilhado já consome o carrinho real, inclusive o carrinho
visitante. Endereço, frete, pagamento e autenticação continuam sendo etapas
compartilhadas e devem evoluir fora dos renderers de tema.

Para testar outro renderer, associe na API um template com `folder` ou `slug`
igual à pasta desejada. A seleção continua baseada exclusivamente no template
retornado por `GET /site`; o frontend não vincula um renderer diretamente a um
domínio ou ao valor de `NUXT_STOREFRONT_SITE`.

## Variáveis de ambiente

Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

Variáveis disponíveis:

```env
NUXT_API_BASE=http://elinea-api.test/api/v1
NUXT_STOREFRONT_SITE=default
NUXT_ELINEA_STORE_KEY=
NUXT_ELINEA_STORE_SECRET=
```

- `NUXT_API_BASE`: endereço da API consumida pelo servidor Nuxt. Não é exposto como
  configuração pública ao navegador.
- `NUXT_STOREFRONT_SITE`: domínio ou slug usado somente como fallback local.
- `NUXT_ELINEA_STORE_KEY`: identificador da loja emitido pela API.
- `NUXT_ELINEA_STORE_SECRET`: segredo privado usado somente pelo servidor Nitro.
  Nunca use prefixo `NUXT_PUBLIC_` para essa variável.

## Teste rápido no navegador

Inicie o Nuxt:

```powershell
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Nesse modo, a loja vem de `NUXT_STOREFRONT_SITE`. Para testar outro tenant, altere
o valor no `.env` e reinicie o servidor Nuxt:

```env
NUXT_STOREFRONT_SITE=supermercado-estrela
```

Para testar outro layout no mesmo tenant, não basta alterar `NUXT_STOREFRONT_SITE`.
Atualize na API o template associado ao `Site` resolvido, garantindo que
`templates.folder` corresponda a um renderer existente em `app/components/templates`.

## Teste local usando os domínios das lojas

Abra como administrador o arquivo:

```text
C:\Windows\System32\drivers\etc\hosts
```

Adicione:

```text
127.0.0.1 default.elinea.com.br
127.0.0.1 supermercado-estrela.elinea.com.br
127.0.0.1 supermercado-estrela-2.elinea.com.br
```

Com `npm run dev` ativo, acesse:

```text
http://default.elinea.com.br:3000
http://supermercado-estrela.elinea.com.br:3000
http://supermercado-estrela-2.elinea.com.br:3000
```

O domínio acessado será encaminhado à API e cada endereço deverá renderizar sua
respectiva loja. Enquanto o template `default` não estiver construído, aparecerá a
tela de fallback com nome da loja, domínio resolvido e contagem dos dados recebidos.

## Validação técnica

Antes de entregar mudanças, execute:

```powershell
npm run typecheck
npm run build
```

Para validar apenas a agregação com o servidor Nuxt em execução:

```powershell
Invoke-WebRequest `
  -Uri 'http://localhost:3000/api/storefront' `
  -Headers @{'X-Site'='supermercado-estrela.elinea.com.br'}
```

## Tratamento de falhas

- Falha ao resolver `/site`: o endpoint Nuxt responde `404` para loja inexistente ou
  `502` quando a API está indisponível.
- Falha em produtos, categorias, analytics ou newsletter: o site ainda é retornado,
  o recurso recebe um valor vazio/nulo e a ocorrência aparece em `warnings`.
- Template não registrado: o renderer de fallback é utilizado.

Essa tolerância parcial permite que uma integração secundária indisponível não
derrube toda a storefront, mas mantém a resolução da loja como requisito obrigatório.

## Templates por cliente

- O contrato para criar renderers está em `docs/themes.md`.
- `folder` é somente a chave técnica que seleciona código presente no build.
- Credenciais de loja selecionam o tenant em produção; `NUXT_STOREFRONT_SITE` e
  `X-Site` são fallbacks locais/legados e não selecionam o template visual.
- Não existem marketplace, ativação, licença, preset ou customização visual via API.
- O layer `layers/storefront-core` contém somente a parcela transitória ainda não
  migrada para `@elinea/ui` ou para adapters do storefront.
- Checkout e área do cliente permanecem compartilhados pelo roteador central.
- `base` é o blueprint inicial para novos clientes.
