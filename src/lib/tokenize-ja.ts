import { invoke } from "@tauri-apps/api/core"

/**
 * Japanese tokenization for the search pipeline.
 *
 * Default backend is `Intl.Segmenter('ja', { granularity: 'word' })`,
 * which is built into all Tauri webview engines (WebKit, WebView2,
 * WebKitGTK ≥ 2.40). It gives reasonable word-level segmentation
 * without bundling a dictionary.
 *
 * For higher accuracy (POS-aware, base-form normalization), the user
 * can switch to the Lindera backend in Settings → tokenizer mode;
 * that path is implemented in `tokenizeJapaneseLindera` (Phase 3b)
 * via a Tauri command. See `tokenize-ja.lindera.ts` once it lands.
 *
 * The function de-duplicates output and removes Japanese stop words
 * (particles, copula, frequent verbs) so the substring-matching
 * search pipeline doesn't waste cycles on noise.
 */

export const JA_STOP_WORDS: ReadonlySet<string> = new Set([
  // 助詞 (particles)
  "の", "を", "が", "は", "で", "に", "へ", "と", "も", "や", "か",
  "から", "まで", "より", "ね", "よ", "な",
  // 接続助詞・終助詞・指示詞
  "て", "ば", "けど", "けれど", "しかし", "そして", "また",
  "これ", "それ", "あれ", "この", "その", "あの",
  "ここ", "そこ", "あそこ",
  // 形式名詞 (formal nouns) — high-frequency filler in search queries
  "こと", "もの", "ため", "よう", "とき", "ところ",
  // 助動詞・コピュラ
  "だ", "です", "である", "ます", "した", "する", "される", "せる",
  "れる", "られる", "ない", "なかっ",
  // 高頻度動詞・形容詞
  "ある", "いる", "なる", "なっ", "言う", "言っ", "思う", "見る",
])

// Use Unicode property escapes (\p{Script=…}) instead of literal ranges.
// This is more robust: it covers CJK Extension B+ for kanji (e.g. rare
// given-name characters like 𠮷) and doesn't depend on visually-confusable
// boundary characters in source code.
const HIRAGANA_OR_KATAKANA = /\p{Script=Hiragana}|\p{Script=Katakana}/u
const KANJI = /\p{Script=Han}/u

export function hasJapanese(text: string): boolean {
  if (!text) return false
  return HIRAGANA_OR_KATAKANA.test(text) || KANJI.test(text)
}

/**
 * Tokenize a Japanese (or mixed-script) string into a deduplicated
 * list of search tokens, with stop-words removed and length filter
 * applied. Uses the always-available Intl.Segmenter.
 */
// Minimal local typings for Intl.Segmenter. The project's tsconfig targets
// ES2020 + DOM (no ES2022.Intl), so we cannot rely on the built-in type.
// Intl.Segmenter is available at runtime in every supported Tauri webview
// and in Node ≥ 16, which is what we actually depend on.
interface SegmenterOptions {
  granularity?: "grapheme" | "word" | "sentence"
}
interface SegmentData {
  segment: string
  index: number
  input: string
  isWordLike?: boolean
}
interface SegmenterLike {
  segment(input: string): Iterable<SegmentData>
}
interface SegmenterCtorLike {
  new (locale?: string, options?: SegmenterOptions): SegmenterLike
}

/**
 * Tokenize a Japanese (or mixed-script) string into a deduplicated
 * list of search tokens, with stop-words removed and length filter
 * applied. Uses the always-available Intl.Segmenter.
 */
export function tokenizeJapanese(text: string): string[] {
  if (!text) return []

  // Intl.Segmenter is statically available in all supported Tauri
  // webviews. Defensive guard for unusual test runners that lack it.
  const SegmenterCtor = (Intl as unknown as { Segmenter?: SegmenterCtorLike })
    .Segmenter
  if (!SegmenterCtor) {
    // Fallback — naive whitespace split. Better than crashing; the
    // tests assume Segmenter exists, so this branch should rarely run.
    return [...new Set(text.split(/\s+/).filter(Boolean))]
  }

  const seg = new SegmenterCtor("ja", { granularity: "word" })
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of seg.segment(text)) {
    if (!part.isWordLike) continue
    const w = part.segment.trim()
    if (w.length < 1) continue
    if (JA_STOP_WORDS.has(w)) continue
    // Skip anything that is purely whitespace or punctuation masquerading as a word.
    if (/^[\s\p{P}]+$/u.test(w)) continue
    if (seen.has(w)) continue
    seen.add(w)
    out.push(w)
  }
  return out
}

let linderaUnavailable = false

/**
 * Lindera-backed tokenizer. Goes through the Tauri command added in
 * Phase 3b. Returns null if the runtime isn't a Tauri window or if a
 * previous call failed (sticky — don't keep paying the round-trip cost).
 */
export async function tokenizeJapaneseLindera(text: string): Promise<string[] | null> {
  if (linderaUnavailable) return null
  if (!text) return []
  try {
    const result = await invoke<string[]>("tokenize_ja", { text })
    // Apply JS-side stop word filter on top of Lindera's POS filter as
    // a safety net (e.g. user-tuned stop word lists in the future).
    return result.filter((w) => !JA_STOP_WORDS.has(w))
  } catch (err) {
    console.warn("[tokenize-ja] Lindera unavailable, falling back to Intl.Segmenter:", err)
    linderaUnavailable = true
    return null
  }
}

/**
 * High-level dispatcher: pick Lindera or Intl.Segmenter based on the
 * runtime preference, with automatic fallback.
 */
export async function tokenizeJapaneseAdaptive(
  text: string,
  mode: "auto" | "lindera",
): Promise<string[]> {
  if (mode === "lindera") {
    const r = await tokenizeJapaneseLindera(text)
    if (r !== null) return r
  }
  return tokenizeJapanese(text)
}
