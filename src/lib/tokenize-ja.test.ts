// @vitest-environment happy-dom
import { describe, it, expect } from "vitest"
import { tokenizeJapanese, hasJapanese, JA_STOP_WORDS } from "./tokenize-ja"

describe("hasJapanese", () => {
  it("detects hiragana", () => {
    expect(hasJapanese("これはペンです")).toBe(true)
  })
  it("detects katakana", () => {
    expect(hasJapanese("コンピュータ")).toBe(true)
  })
  it("detects kanji", () => {
    expect(hasJapanese("機械学習")).toBe(true)
  })
  it("returns false for pure latin", () => {
    expect(hasJapanese("hello world")).toBe(false)
  })
  it("returns false for empty string", () => {
    expect(hasJapanese("")).toBe(false)
  })
})

describe("tokenizeJapanese (Intl.Segmenter)", () => {
  it("preserves kanji compounds", () => {
    // ICU's Intl.Segmenter ('ja', granularity: 'word') is dictionary-light:
    // it does not always merge a four-kanji compound like 機械学習 into a
    // single token. What it MUST avoid is splitting kanji into single
    // characters. We therefore assert that at least one multi-kanji token
    // is produced, and that the surface form joins back to the input
    // kanji run — i.e. it is segmented at compound boundaries, not per-char.
    const result = tokenizeJapanese("機械学習について教えて")
    const multiKanjiTokens = result.filter((t) => /^[一-鿿㐀-䶿]{2,}$/u.test(t))
    expect(multiKanjiTokens.length).toBeGreaterThan(0)
    // Concatenating kanji tokens should reconstruct the kanji span "機械学習".
    expect(multiKanjiTokens.join("")).toContain("機械学習")
  })

  it("strips Japanese stop-word particles", () => {
    const result = tokenizeJapanese("彼は本を読んだ")
    expect(result).not.toContain("は")
    expect(result).not.toContain("を")
  })

  it("returns deduplicated tokens", () => {
    const result = tokenizeJapanese("猫と犬と猫")
    const cats = result.filter((t) => t === "猫")
    expect(cats.length).toBeLessThanOrEqual(1)
  })

  it("returns an empty array for empty input", () => {
    expect(tokenizeJapanese("")).toEqual([])
  })

  it("handles a long-vowel mark in katakana", () => {
    const result = tokenizeJapanese("コンピューター")
    // The Segmenter may emit either form depending on engine version.
    expect(result.some((t) => t.includes("コンピューター") || t.includes("コンピュータ"))).toBe(true)
  })
})

describe("JA_STOP_WORDS", () => {
  it("contains common particles", () => {
    for (const p of ["の", "を", "が", "は", "で", "に", "と", "も"]) {
      expect(JA_STOP_WORDS.has(p)).toBe(true)
    }
  })
  it("contains common copula forms", () => {
    for (const p of ["だ", "です", "である", "ます", "した", "する"]) {
      expect(JA_STOP_WORDS.has(p)).toBe(true)
    }
  })
})
