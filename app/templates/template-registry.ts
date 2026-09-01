import type { Component } from 'vue'

type TemplateModule = { default: Component }
type TemplateLoader = () => Promise<TemplateModule>

const templateModules = import.meta.glob<TemplateModule>('../components/templates/*/*Template.vue')

const templateRegistry = Object.fromEntries(
  Object.entries(templateModules).map(([path, loader]) => {
    const templateKey = path.split('/').at(-2)

    if (!templateKey) {
      throw new Error(`Não foi possível resolver o template em ${path}.`)
    }

    return [templateKey, defineAsyncComponent(async () => (await (loader as TemplateLoader)()).default)]
  }),
) as Record<string, Component>

export function resolveStorefrontTemplate(templateKey: string): Component | null {
  return templateRegistry[templateKey] ?? null
}

export function storefrontTemplateKeys(): string[] {
  return Object.keys(templateRegistry).sort()
}
