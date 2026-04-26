import { useWikiStore } from "@/stores/wiki-store"
import { detectLanguage } from "./detect-language"

/**
 * Get the effective output language for LLM content generation.
 *
 * If user has explicitly set an outputLanguage, use it.
 * Otherwise (auto), fall back to detecting the language from the given text.
 */
export function getOutputLanguage(fallbackText: string = ""): string {
  const configured = useWikiStore.getState().outputLanguage
  if (configured && configured !== "auto") {
    return configured
  }
  return detectLanguage(fallbackText || "English")
}

/**
 * Build a strong language directive to inject into system prompts.
 */
export function buildLanguageDirective(fallbackText: string = ""): string {
  const lang = getOutputLanguage(fallbackText)
  const lines = [
    `## ⚠️ MANDATORY OUTPUT LANGUAGE: ${lang}`,
    "",
    `You MUST write your entire response (including wiki page titles, content, descriptions, summaries, and any generated text) in **${lang}**.`,
    `The source material or wiki content may be in a different language, but this is IRRELEVANT to your output language.`,
    `Ignore the language of any source content. Generate everything in ${lang} only.`,
    `Proper nouns should use standard ${lang} transliteration when appropriate.`,
    `DO NOT use any other language. This overrides all other instructions.`,
  ]
  if (lang === "Japanese") {
    lines.push(
      "",
      "## 日本語特有のガイドライン",
      "- 外来語・固有名詞・技術用語はカタカナ表記を基本とする (例: Transformer→トランスフォーマー、Embedding→エンベディング)。ただし広く定着している英語表記 (e.g. API, JSON, HTTP, GPU, LLM) はそのまま英字でよい。",
      "- wiki ページタイトルは可能な限り簡潔な日本語の名詞句にする。",
      "- ファイル名 (slug) は kebab-case を維持し、必要に応じて kanji/kana → ローマ字 (例: title=「機械学習」 → file=`machine-learning.md`)。",
      "- 文体は「である調」を基本とし、ユーザーが「です・ます調」で問いかけた場合はその文体に合わせる。",
      "- 引用は [1], [2] のように半角の角括弧で記述する (全角の【】は使わない)。",
    )
  }
  return lines.join("\n")
}

/**
 * Short reminder version — for placing right before user's current message.
 */
export function buildLanguageReminder(fallbackText: string = ""): string {
  const lang = getOutputLanguage(fallbackText)
  return `REMINDER: All output must be in ${lang}. Do not use any other language.`
}
