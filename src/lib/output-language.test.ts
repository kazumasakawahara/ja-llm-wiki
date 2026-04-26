import { describe, it, expect, beforeEach } from "vitest"
import { getOutputLanguage, buildLanguageDirective, buildLanguageReminder } from "./output-language"
import { useWikiStore } from "@/stores/wiki-store"

// Reset the outputLanguage back to "auto" before each test so tests can't
// leak state into one another via the shared Zustand store.
beforeEach(() => {
  useWikiStore.getState().setOutputLanguage("auto")
})

describe("getOutputLanguage", () => {
  it("uses the explicit user setting verbatim (French)", () => {
    useWikiStore.getState().setOutputLanguage("French")
    expect(getOutputLanguage("whatever fallback text")).toBe("French")
  })

  it("explicit user setting beats fallback detection (source is English, setting is Japanese)", () => {
    useWikiStore.getState().setOutputLanguage("Japanese")
    expect(getOutputLanguage("This is clearly English text")).toBe("Japanese")
  })

  it("auto mode falls back to detectLanguage on the fallback text", () => {
    useWikiStore.getState().setOutputLanguage("auto")
    expect(getOutputLanguage("注意力机制是什么")).toBe("Chinese")
  })

  it("auto mode with empty fallback defaults to English", () => {
    useWikiStore.getState().setOutputLanguage("auto")
    expect(getOutputLanguage("")).toBe("English")
  })

  it("auto mode with no fallback arg defaults to English", () => {
    useWikiStore.getState().setOutputLanguage("auto")
    expect(getOutputLanguage()).toBe("English")
  })
})

describe("buildLanguageDirective", () => {
  it("contains the MANDATORY OUTPUT LANGUAGE header", () => {
    useWikiStore.getState().setOutputLanguage("French")
    const directive = buildLanguageDirective()
    expect(directive).toContain("MANDATORY OUTPUT LANGUAGE: French")
  })

  it("names the language multiple times for emphasis", () => {
    useWikiStore.getState().setOutputLanguage("Japanese")
    const directive = buildLanguageDirective()
    // Should include 'Japanese' at least 4× (header + instructions)
    const count = (directive.match(/Japanese/g) || []).length
    expect(count).toBeGreaterThanOrEqual(4)
  })

  it("follows the explicit setting even when fallback text is in another language", () => {
    useWikiStore.getState().setOutputLanguage("Vietnamese")
    const directive = buildLanguageDirective("这段文字是中文")
    expect(directive).toContain("Vietnamese")
    expect(directive).not.toContain("MANDATORY OUTPUT LANGUAGE: Chinese")
  })

  it("uses detected language in auto mode", () => {
    useWikiStore.getState().setOutputLanguage("auto")
    const directive = buildLanguageDirective("Xử lý nước thải là vấn đề quan trọng")
    expect(directive).toContain("Vietnamese")
  })

  it("explicitly overrides source content language", () => {
    useWikiStore.getState().setOutputLanguage("English")
    const directive = buildLanguageDirective()
    expect(directive).toContain("IRRELEVANT to your output language")
  })
})

describe("buildLanguageReminder", () => {
  it("is a concise reminder, not a full directive", () => {
    useWikiStore.getState().setOutputLanguage("French")
    const reminder = buildLanguageReminder()
    expect(reminder).toMatch(/All output must be in French/)
    // Reminder should be ONE line, not a multi-line block
    expect(reminder.split("\n").length).toBe(1)
  })

  it("uses the explicit setting", () => {
    useWikiStore.getState().setOutputLanguage("Korean")
    expect(buildLanguageReminder("ignored fallback")).toContain("Korean")
  })

  it("uses detected language in auto mode", () => {
    useWikiStore.getState().setOutputLanguage("auto")
    expect(buildLanguageReminder("これは日本語です")).toContain("Japanese")
  })
})

describe("buildLanguageDirective — Japanese specifics", () => {
  it("includes katakana / 文体 guidelines for Japanese output", () => {
    useWikiStore.getState().setOutputLanguage("Japanese")
    const dir = buildLanguageDirective("こんにちは")
    expect(dir).toContain("Japanese")
    // The Japanese addendum should mention katakana transliteration
    expect(dir).toMatch(/カタカナ|katakana/i)
    // ... and 文体 (writing style) guidance
    expect(dir).toMatch(/文体|である調|です・?ます調/)
  })

  it("does NOT include the Japanese addendum when output is English", () => {
    useWikiStore.getState().setOutputLanguage("English")
    const dir = buildLanguageDirective("hello")
    expect(dir).toContain("English")
    expect(dir).not.toMatch(/カタカナ|である調/)
  })
})
