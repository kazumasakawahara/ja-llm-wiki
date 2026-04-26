import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import type { SettingsDraft, DraftSetter } from "../settings-types"

interface Props {
  draft: SettingsDraft
  setDraft: DraftSetter
}

const MODES = [
  { value: "auto", labelKey: "settings.sections.about.tokenizerAuto" },
  { value: "lindera", labelKey: "settings.sections.about.tokenizerLindera" },
] as const

export function TokenizerSection({ draft, setDraft }: Props) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <Label>{t("settings.sections.about.tokenizer")}</Label>
      <p className="text-xs text-muted-foreground">
        {t("settings.sections.about.tokenizerHint")}
      </p>
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const active = draft.tokenizerMode === m.value
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setDraft("tokenizerMode", m.value)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
              }`}
            >
              {t(m.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
