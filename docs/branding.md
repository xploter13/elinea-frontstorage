# Branding do storefront

Cada repositório representa uma loja e contém apenas uma identidade visual ativa.
Não crie renderers por tenant dentro deste projeto.

## Onde personalizar

- `app/components/storefront/base.config.ts`: textos, cores e tipografia;
- `app/assets`: estilos e assets processados pelo build;
- `public`: arquivos públicos estáticos;
- `app/components/storefront`: composição exclusiva da loja.

O design atual é o baseline aprovado e também orienta os defaults de `@elinea/ui`.
Antes de criar um componente local, verifique se props, slots, variantes ou tokens no
UI resolvem a necessidade sem duplicar comportamento de ecommerce.

## Nova loja

1. replique este repositório;
2. configure as credenciais da loja no `.env`;
3. personalize branding e assets quando necessário;
4. execute typecheck, build e validação visual;
5. publique como aplicação Nuxt SSR independente.

O campo técnico de template eventualmente retornado pela API não controla este
storefront e não deve ser usado para carregar código dinamicamente.
