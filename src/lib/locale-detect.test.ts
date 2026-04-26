import { describe, it, expect } from "vitest"
import { detectInitialLocale } from "./locale-detect"

describe("detectInitialLocale", () => {
  it("returns 'ja' when navigator.language starts with 'ja'", () => {
    expect(detectInitialLocale("ja")).toBe("ja")
    expect(detectInitialLocale("ja-JP")).toBe("ja")
    expect(detectInitialLocale("ja-jp")).toBe("ja")
    // Case folding: navigator.language is canonically lower-case, but
    // be defensive against an upper-cased primary subtag.
    expect(detectInitialLocale("JA")).toBe("ja")
  })

  it("returns 'en' for any non-ja locale", () => {
    expect(detectInitialLocale("en")).toBe("en")
    expect(detectInitialLocale("en-US")).toBe("en")
    expect(detectInitialLocale("zh-CN")).toBe("en")
    expect(detectInitialLocale("ko-KR")).toBe("en")
    // Underscore is not a valid BCP47 separator — `ja_JP` must NOT
    // be treated as Japanese (would mean a misconfigured caller).
    expect(detectInitialLocale("ja_JP")).toBe("en")
  })

  it("returns 'en' for empty / undefined input", () => {
    expect(detectInitialLocale("")).toBe("en")
    expect(detectInitialLocale(undefined)).toBe("en")
  })
})
