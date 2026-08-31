# Contexto do Elinea Frontstorage

Este documento é a referência de arquitetura e desenvolvimento do storefront da
Elinea. Deve ser atualizado sempre que o contrato com a API, a resolução de tenant
ou a estratégia de templates mudar.

## Objetivo

O `elinea-frontstorage` é uma aplicação Nuxt responsável por renderizar a loja
correta com base no domínio da requisição. Conteúdo, configurações e identificação
do template são fornecidos pela API `elinea-api`.

O projeto não mantém uma lista própria de lojas. A API é a fonte da verdade para
tenants, produtos, categorias, integrações e demais dados do ecommerce.

## Fluxo multi-tenant

```text
Requisição no domínio da loja
        ↓
Nuxt identifica Host / X-Forwarded-Host
        ↓
Nuxt envia o domínio no header X-Site
        ↓
API resolve o tenant e isola os dados pelo site_id
        ↓
GET /api/v1/site informa site e template
        ↓
Nuxt seleciona o renderer por template.folder ou template.slug
```

O header `X-Site` pode receber o domínio ou o slug da loja. Em produção, o valor
normal é o domínio acessado pelo usuário. Em `localhost`, o fallback é definido por
`NUXT_STOREFRONT_SITE`.

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

Todas essas chamadas enviam:

```http
Accept: application/json
X-Site: dominio-ou-slug-da-loja
```

As respostas Laravel usam o envelope padrão:

```json
{
  "data": {}
}
```

`GET /site` retorna um único objeto quando o tenant foi resolvido. A listagem de
lojas pertence a `GET /sites` e retorna um array em `data`.

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
de componentes em `app/pages/[...path].vue`. Caso não exista renderer registrado,
`TemplateFallback.vue` mostra uma página de diagnóstico sem impedir a validação do
tenant e dos dados.

Um template futuro deve:

1. ser criado em `app/components/templates`;
2. receber uma prop `storefront` do tipo `StorefrontPayload`;
3. ser registrado no `templateRegistry` com a mesma chave de `template.folder`;
4. usar somente dados do tenant presentes no payload, sem valores fixos de loja.

Renderers disponíveis no MVP:

| Chave (`folder` ou `slug`) | Componente | Direção visual |
|---|---|---|
| `default` | `TemplateDefault.vue` | Varejo vibrante, denso e orientado a ofertas |
| `editorial` | `TemplateEditorial.vue` | Varejo minimalista, assimétrico e orientado a curadoria |
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

Os formulários e ações de compra permanecem em estado de integração até que os
contratos de carrinho, autenticação, endereço e pagamento sejam disponibilizados
pela API.

Para testar o segundo renderer, associe na API um template com `folder` ou `slug`
igual a `editorial`. A seleção continua baseada exclusivamente no template retornado
por `GET /site`; o frontend não vincula um renderer diretamente a um domínio.

## Variáveis de ambiente

Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

Variáveis disponíveis:

```env
NUXT_API_BASE=http://elinea-api.test/api/v1
NUXT_STOREFRONT_SITE=default
```

- `NUXT_API_BASE`: endereço da API consumida pelo servidor Nuxt. Não é exposto como
  configuração pública ao navegador.
- `NUXT_STOREFRONT_SITE`: domínio ou slug usado somente como fallback local.

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

## Temas gerenciáveis

- O contrato completo para criação, registro, ativação e personalização de temas
  está em `docs/themes.md`.
- `folder` seleciona o renderer e `segment` controla a compatibilidade comercial.
- Checkout e área do cliente permanecem compartilhados pelo roteador central.
- O tema `pharmacy` possui conteúdo principal gerenciável pelo painel, além de
  cores, tipografia e imagens.
