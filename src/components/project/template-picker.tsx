import { useTranslation } from "react-i18next"
import { getTemplates, type TemplateLocale } from "@/lib/templates"
import { cn } from "@/lib/utils"

interface TemplatePickerProps {
  selected: string
  onSelect: (id: string) => void
}

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const { i18n } = useTranslation()
  const locale: TemplateLocale = i18n.language === "ja" ? "ja" : "en"
  const templates = getTemplates(locale)
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={cn(
            "flex flex-col gap-1 rounded-md border p-3 text-left transition-colors hover:bg-accent",
            selected === template.id
              ? "border-primary bg-accent ring-1 ring-primary"
              : "border-border bg-background"
          )}
        >
          <span className="text-xl leading-none">{template.icon}</span>
          <span className="text-sm font-medium leading-tight">{template.name}</span>
          <span className="text-xs text-muted-foreground leading-tight">{template.description}</span>
        </button>
      ))}
    </div>
  )
}
