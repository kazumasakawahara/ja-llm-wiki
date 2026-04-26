import { TEMPLATES_EN } from "./templates.en"
import { TEMPLATES_JA } from "./templates.ja"

export interface WikiTemplate {
  id: string
  name: string
  description: string
  icon: string
  schema: string
  purpose: string
  extraDirs: string[]
}

export type TemplateLocale = "en" | "ja"

export function getTemplates(locale: TemplateLocale): WikiTemplate[] {
  return locale === "ja" ? TEMPLATES_JA : TEMPLATES_EN
}

export function getTemplate(id: string, locale: TemplateLocale = "en"): WikiTemplate {
  const templates = getTemplates(locale)
  const found = templates.find((t) => t.id === id)
  if (!found) {
    throw new Error(`Unknown template id: "${id}" (locale=${locale})`)
  }
  return found
}
