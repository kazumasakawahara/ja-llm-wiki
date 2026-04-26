/**
 * Decide the initial UI language for first launch (when no saved
 * preference exists). Hardcoded set of supported UI locales — anything
 * else falls back to English.
 *
 * The OS locale comes from the browser's `navigator.language`, which
 * Tauri's webview surfaces from the host OS. We treat any `ja*` tag
 * as Japanese (covers `ja`, `ja-JP`, future regional variants) and
 * everything else as English.
 */
export type SupportedLocale = "en" | "ja"

export function detectInitialLocale(navigatorLanguage: string | undefined): SupportedLocale {
  if (!navigatorLanguage) return "en"
  const lower = navigatorLanguage.toLowerCase()
  if (lower === "ja" || lower.startsWith("ja-")) return "ja"
  return "en"
}
