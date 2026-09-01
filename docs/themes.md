# Desenvolvimento de temas da Elinea

Este documento define o contrato entre `elinea-api`, `elinea-admin` e
`elinea-storefront`. Ele deve ser seguido sempre que um novo tema for criado ou
quando um tema existente ganhar campos gerenciáveis.

## Responsabilidade de cada projeto

- `elinea-api`: registra o tema, filtra por segmento, controla licença e ativação,
  valida configurações e entrega o tema do tenant no endpoint público da loja.
- `elinea-admin`: lista e ativa temas e oferece os campos de personalização que o
  lojista pode alterar.
- `elinea-storefront`: resolve o renderer pelo campo `folder` e consome apenas os
  dados públicos recebidos da API.

O checkout e a área do cliente são compartilhados. Um tema não deve implementar
cópias dessas páginas. O roteamento central em `app/pages/[...path].vue` deve
continuar direcionando `checkout` para `SharedCheckout` e `account` para
`SharedCustomerArea`.

## Identificadores

- `slug`: identificador comercial persistido no catálogo, por exemplo `farmacia`.
- `folder`: chave técnica do renderer, por exemplo `pharmacy`.
- `segment`: segmento da loja ao qual o tema se aplica, por exemplo `pharmacy`.
- `general`: segmento especial para temas que podem ser usados por qualquer loja.

O marketplace do tenant exibe temas `general` e temas cujo `segment` seja igual ao
segmento da loja. A ativação repete essa validação no servidor; esconder um tema no
frontend nunca substitui essa proteção.

## Fluxo de ativação

1. O admin envia `POST /api/v1/marketplace/themes/{theme}/activate` com `X-Site`.
2. A API valida publicação, canal, segmento e licença.
3. A API atualiza `sites.template_id`.
4. O preset em `templates.settings` é aplicado a `configuration.tema`.
5. O storefront recebe `site.template.folder` e `site.theme` em `/api/v1/site`.
6. O renderer correspondente é carregado pelo registro em `app/pages/[...path].vue`.

Somente chaves declaradas em `ConfigurationService::baseDefinitions()` são
persistidas durante a ativação ou pelo editor. Toda chave nova precisa existir na
API, no tipo `StoreTheme`, no editor e no componente que a consome.

## Checklist para criar um tema

### API

1. Adicione o preset ao `database/seeders/TemplateSeeder.php` usando
   `Template::updateOrCreate`.
2. Use um `folder` que exista no storefront e inclua os canais `admin` e/ou
   `landing_page` conforme o produto.
3. Inclua o `folder` permitido em `ThemeRequest`.
4. Declare cada configuração editável na seção `tema` de `ConfigurationService`.
5. Valide configurações específicas em `ThemeRequest`.
6. Cubra cadastro, catálogo por segmento, ativação e aplicação do preset em
   `ThemeMarketplaceTest`.

### Admin

1. Atualize o tipo `MarketplaceTheme.folder`.
2. Crie uma seção condicional no `ThemeEditor` baseada no `folder` ativo.
3. Exiba apenas conteúdo realmente consumido pelo tema.
4. Após ativar, atualize `useSiteContext().currentSite` para o editor reconhecer o
   tema sem recarregar a aplicação.
5. Mantenha uma prévia coerente com os campos principais.

### Storefront

1. Crie `app/components/templates/{folder}/{Tema}Template.vue`.
2. Registre o `folder` nos registros `homeRegistry` e `internalRegistry`.
3. Adicione as novas propriedades a `shared/types/storefront.ts`.
4. Use valores da API com fallbacks seguros; textos comerciais, telefone e imagens
   principais não devem ficar exclusivamente fixos no componente.
5. Preserve responsividade, estados vazios, imagens ausentes e rotas internas.
6. Não duplique checkout nem área do cliente.

### Componentes e comércio compartilhados

- DaisyUI é a base funcional dos temas: prefira `btn`, `badge`, `card`, `input`,
  `select`, `checkbox`, `toggle`, `tabs`, `drawer`, `modal`, `alert`, `join`,
  `loading` e `toast` antes de criar um componente equivalente.
- A identidade visual continua no CSS do tema. As classes DaisyUI resolvem
  comportamento, estados e acessibilidade; cores, tipografia, ritmo e composição
  devem consumir `site.theme` e manter a personalidade do segmento.
- Carrinho e lista de desejos devem usar `useStorefrontCommerce`. Não crie estado
  paralelo dentro de cards, cabeçalhos ou páginas.
- Todo botão de compra deve funcionar como visitante. O composable cria e envia
  `X-Cart-Session`; login não é pré-condição para montar o pedido.
- Cards e página de produto devem refletir os mesmos estados de carregamento,
  estoque, carrinho e favorito.
- Filtros devem derivar dos produtos e categorias recebidos da API, manter estado
  visível, oferecer limpeza e informar a quantidade de resultados.

## Configurações do tema Farmácia

As configurações genéricas são logo, favicon, imagem do hero, três cores, fonte,
título e texto do hero, título da vitrine e visibilidade da newsletter.

O tema Farmácia acrescenta:

| Grupo | Chaves |
| --- | --- |
| Cabeçalho | `header_message`, `contact_phone`, `service_hours` |
| Hero | `hero_eyebrow`, `hero_cta_label` |
| Navegação | `categories_title` |
| Banners | `promo_primary_*`, `promo_secondary_*`, `promo_tertiary_*` |
| Ofertas | `offers_callout_title`, `offers_callout_text`, `popular_title` |
| Newsletter | `newsletter_eyebrow`, `newsletter_title`, `newsletter_text`, `newsletter_button_label` |
| Rodapé | `footer_tagline`, `footer_description` |

Chaves específicas devem descrever conteúdo, não posição visual. Isso permite
lapidar o layout sem migrar dados do lojista.

## Convenções de implementação

- Use inglês nas chaves técnicas e português nos rótulos do painel.
- Use `snake_case` em configurações persistidas.
- Não use o `slug` como chave do renderer quando o `folder` estiver disponível.
- Não confie em union types do frontend como validação de segurança.
- Presets não devem incluir `logo_path`, `favicon_path` ou outros dados próprios do
  tenant, evitando sobrescrever a identidade já enviada pelo lojista.
- Valores opcionais devem ter fallback no storefront.
- Temas do mesmo segmento podem compartilhar componentes, mas cada `folder` deve
  corresponder a um renderer conhecido.
- A tipografia de leitura não deve ficar abaixo de `1rem` em desktop; metadados
  podem ser menores desde que preservem contraste e legibilidade.
- O tema Farmácia usa serifas na leitura e nos títulos como assinatura editorial,
  combinadas a controles diretos e densidade moderada de varejo.

## Validação antes de entregar

```powershell
# API
php artisan test --compact tests/Feature/ThemeMarketplaceTest.php tests/Feature/ConfigurationManagementTest.php
php vendor/bin/pint --dirty

# Admin
npm run build

# Storefront
npm run typecheck
npm run build
```

O admin ainda não possui `vue-tsc` fixado nas dependências; até essa manutenção de
tooling ser concluída, o build de produção é sua validação frontend reproduzível.

Também valide manualmente: catálogo correto para dois segmentos distintos,
ativação sem recarregar o painel, persistência após atualizar a página, hero com e
sem imagem, páginas internas, checkout e área do cliente. Para temas com comércio,
valide ainda: dois visitantes com sessões distintas, adicionar sem login, alterar
quantidade, remover item, persistir favoritos, limpar filtros e navegar com busca.

## Definição de pronto

Um tema só está pronto quando está registrado de forma reproduzível, aparece apenas
para lojas compatíveis, pode ser ativado pelo painel, possui conteúdo principal
editável, não depende de dados fixos do desenvolvedor, renderiza todas as páginas
necessárias e passa pelos testes e builds dos três projetos.
