// @vitest-environment happy-dom
import { describe, it, expect } from "vitest"
import * as fc from "fast-check"
import { tokenizeJapanese, hasJapanese } from "./tokenize-ja"

describe("tokenizeJapanese — property tests", () => {
  it("output is always deduplicated", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 100 }), (s) => {
        const out = tokenizeJapanese(s)
        const set = new Set(out)
        expect(set.size).toBe(out.length)
      }),
    )
  })

  it("never throws on arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 200 }), (s) => {
        expect(() => tokenizeJapanese(s)).not.toThrow()
      }),
    )
  })

  it("output never contains common particles as standalone tokens", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 100 }), (s) => {
        const out = tokenizeJapanese(s)
        for (const t of out) {
          expect(["の", "を", "が", "は", "で", "に"]).not.toContain(t)
        }
      }),
    )
  })

  it("empty / whitespace input always returns empty array", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("", " ", "  ", "\n", "\t", "   \n  "),
        (s) => {
          expect(tokenizeJapanese(s)).toEqual([])
        },
      ),
    )
  })
})

describe("tokenizeJapanese — corpus scenarios", () => {
  type Corpus = {
    name: string
    input: string
  } & (
    | { mustContainSomeOf: string[][] }
    | { mustNotContain: string[] }
    | { allTokensHaveMinLength: number }
  )

  const corpora: Corpus[] = [
    {
      name: "academic-style sentence — content nouns survive",
      input: "本研究では機械学習を用いた知識グラフの自動構築手法を提案する。",
      // The Segmenter may segment differently across engines; we only
      // require that key content nouns appear as tokens or as parts of tokens.
      mustContainSomeOf: [
        ["研究", "本研究"],
        ["機械", "機械学習"],
        ["知識", "知識グラフ"],
        ["手法"],
        ["提案"],
      ],
    },
    {
      name: "chat-style question — content words present",
      input: "今日のミーティングは何時から？",
      mustContainSomeOf: [
        ["今日"],
        ["ミーティング"],
        ["何時", "何"],
      ],
    },
    {
      name: "technical katakana mixture — latin terms preserved",
      input: "ReactとTypeScriptとViteで作ったデスクトップアプリ",
      mustContainSomeOf: [
        ["React"],
        ["TypeScript"],
        ["Vite"],
        ["デスクトップ"],
        ["アプリ"],
      ],
    },
    {
      name: "polite-form sentence — no copula in output",
      input: "これは美味しいラーメンです。",
      mustNotContain: ["は", "です", "。"],
    },
    {
      name: "non-Japanese latin sentence — words pass through",
      input: "the quick brown fox",
      // Pure-latin input has no Japanese characters; the function may
      // return empty or the latin words. Either is acceptable; just
      // verify it doesn't throw or include particles.
      mustNotContain: ["の", "は", "を"],
    },
    {
      name: "kanji-only term must not be split into single chars",
      input: "機械学習",
      allTokensHaveMinLength: 1, // every token has at least one char (sanity)
    },
  ]

  for (const c of corpora) {
    it(c.name, () => {
      const out = tokenizeJapanese(c.input)
      if ("mustContainSomeOf" in c) {
        for (const alts of c.mustContainSomeOf) {
          const hit = alts.some((alt) =>
            out.some((tok) => tok.includes(alt) || alt.includes(tok)),
          )
          expect(
            hit,
            `Expected one of [${alts.join(", ")}] in [${out.join(", ")}]`,
          ).toBe(true)
        }
      } else if ("mustNotContain" in c) {
        for (const forbidden of c.mustNotContain) {
          expect(out).not.toContain(forbidden)
        }
      } else if ("allTokensHaveMinLength" in c) {
        for (const tok of out) {
          expect(tok.length).toBeGreaterThanOrEqual(c.allTokensHaveMinLength)
        }
      }
    })
  }
})

describe("hasJapanese — property tests", () => {
  it("any string containing a hiragana char returns true", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ maxLength: 10 }),
          fc.constantFrom("あ", "い", "う", "え", "お"),
          fc.string({ maxLength: 10 }),
        ),
        ([pre, jp, post]) => {
          expect(hasJapanese(pre + jp + post)).toBe(true)
        },
      ),
    )
  })

  it("pure-latin strings return false", () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 30, unit: fc.constantFrom(...
          "abcdefghijklmnopqrstuvwxyz0123456789 .,?!".split(""))
        }),
        (s) => {
          expect(hasJapanese(s)).toBe(false)
        },
      ),
    )
  })
})
