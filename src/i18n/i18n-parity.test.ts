/**
 * Structural parity check for the translation bundles.
 *
 * If en.json grows a key that ja.json doesn't have (or vice-versa),
 * the app either falls back to the raw key at runtime (ugly) or
 * silently shows the English string to Japanese users. Both are
 * regressions we want to catch at test time.
 */
import { describe, it, expect } from "vitest"
import en from "./en.json"
import ja from "./ja.json"

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return []
  const out: string[] = []
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === "object") {
      out.push(...flattenKeys(v, path))
    } else {
      out.push(path)
    }
  }
  return out
}

describe("i18n bundle parity (en.json ↔ ja.json)", () => {
  const enKeys = new Set(flattenKeys(en))
  const jaKeys = new Set(flattenKeys(ja))

  it("every en.json key is also in ja.json", () => {
    const missing = [...enKeys].filter((k) => !jaKeys.has(k)).sort()
    expect(
      missing,
      `Keys in en.json but missing from ja.json — add Japanese translations for:\n  ${missing.join("\n  ")}`,
    ).toEqual([])
  })

  it("every ja.json key is also in en.json (no orphaned ja-only strings)", () => {
    const orphaned = [...jaKeys].filter((k) => !enKeys.has(k)).sort()
    expect(
      orphaned,
      `Keys in ja.json but missing from en.json — either add English translations or remove the stale ja-only keys:\n  ${orphaned.join("\n  ")}`,
    ).toEqual([])
  })

  it("every leaf value is a non-empty string", () => {
    const check = (bundle: unknown, label: string) => {
      const keys = flattenKeys(bundle)
      for (const path of keys) {
        let ref: unknown = bundle
        for (const part of path.split(".")) {
          ref = (ref as Record<string, unknown>)[part]
        }
        expect(typeof ref, `${label}: ${path} is not a string`).toBe("string")
        expect((ref as string).length, `${label}: ${path} is empty`).toBeGreaterThan(0)
      }
    }
    check(en, "en.json")
    check(ja, "ja.json")
  })

  it("pluralization keys come in pairs: every foo_plural has a matching foo", () => {
    const check = (bundle: unknown, label: string) => {
      const keys = new Set(flattenKeys(bundle))
      for (const k of keys) {
        if (k.endsWith("_plural")) {
          const singular = k.slice(0, -"_plural".length)
          expect(
            keys.has(singular),
            `${label}: found ${k} but no matching ${singular} (i18next will fall back to the raw key for count=1)`,
          ).toBe(true)
        }
      }
    }
    check(en, "en.json")
    check(ja, "ja.json")
  })
})
