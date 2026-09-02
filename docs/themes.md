# Templates por cliente

Este documento define como criar e manter renderers no `elinea-storefront` sem
marketplace e sem customização visual via API.

## Responsabilidades

- `elinea-api`: resolve o tenant pelo domínio e retorna o `Template` técnico ligado ao `Site`.
- `elinea-storefront`: carrega o renderer correspondente a `template.folder`.
- `elinea-admin`: administra operação, catálogo e pedidos; não edita o layout.
- `elinea-gestao`: administra a plataforma; não mantém catálogo comercial de temas.

Domínio, header `X-Site` e `NUXT_STOREFRONT_SITE` escolhem apenas qual `Site` será
carregado. O renderer visual vem da API pela cadeia `Site -> Template -> folder`.
Portanto, alterar `NUXT_STOREFRONT_SITE` troca o tenant local, mas não substitui o
template associado a esse tenant.

O cadastro de um cliente não gera código durante uma requisição HTTP. Ele inicia o
fluxo de implantação, no qual um renderer é criado, personalizado, versionado,
validado e publicado.

## Storefront Core

O layer `layers/storefront-core` é o SDK interno do storefront. Ele concentra:

- estado e operações de carrinho visitante;
- wishlist isolada por tenant;
- formatação e leitura do catálogo;
- overlay compartilhado de carrinho e favoritos.

Checkout, área do cliente, resolução de domínio, proxy da API, contratos de dados,
SEO e roteamento também permanecem fora dos templates específicos.

Templates devem consumir essas capacidades e não criar estados paralelos.

## Criando um template

Use o template base como blueprint:

```bash
npm run template:create -- farmacia-sao-lucas
```

O comando copia somente a camada visual do blueprint para
`app/components/templates/farmacia-sao-lucas` e renomeia componentes, imports e o
arquivo de branding com a chave informada. O registro é automático: qualquer
arquivo `app/components/templates/{folder}/*Template.vue` é descoberto por
`app/templates/template-registry.ts` e carregado de forma assíncrona.

Depois do scaffold:

1. personalize composição, CSS, textos e assets do cliente;
2. mantenha a prop `storefront: StorefrontPayload`;
3. reutilize os composables do `storefront-core`;
4. preserve páginas de catálogo, categorias, produto e carrinho;
5. execute `npm run typecheck` e `npm run build`;
6. cadastre ou atualize o `Template` técnico na API com `folder` igual à pasta;
7. associe esse `Template` ao `Site` do cliente.

## Identidade visual

Branding é código versionado. Cada renderer mantém seu arquivo `*.config.ts` com
cores, tipografia, textos institucionais e caminhos de assets. Esses valores não são
lidos de `site.theme`, `configuration.tema` ou outro endpoint de personalização.

Dados operacionais continuam dinâmicos e pertencem à API: nome da loja, produtos,
categorias, estoque, preços, integrações, carrinho e pedidos.

## Limites de reutilização

Compartilhe comportamento, não imponha a mesma aparência:

- cards podem ter layouts diferentes, mas usam as mesmas ações de carrinho e wishlist;
- headers podem ter composições diferentes, mas usam o mesmo estado comercial;
- filtros podem variar visualmente, mas derivam dos mesmos produtos e categorias;
- checkout e área do cliente não devem ser copiados para templates;
- estados vazios, loading, erros de imagem e indisponibilidade precisam ser preservados.

## Template técnico

`Template` não representa produto, licença ou tema comprável. Ele é apenas o vínculo
entre um `Site` e um renderer existente no build:

```text
domínio → Site → Template.folder → componente Vue
```

Não permita digitar uma chave arbitrária em um painel. Um `folder` somente deve ser
associado quando o renderer correspondente já estiver versionado e implantado.

## Validação

```bash
npm run typecheck
npm run build
```

Valide também domínio real, home, busca, filtros, produto, carrinho visitante,
wishlist, checkout, área do cliente, responsividade e imagens ausentes.
