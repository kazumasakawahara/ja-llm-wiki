import { describe, it, expect } from "vitest"
import { getTemplate, getTemplates } from "./templates"

describe("templates factory", () => {
  it("returns 5 templates for each locale", () => {
    expect(getTemplates("en")).toHaveLength(5)
    expect(getTemplates("ja")).toHaveLength(5)
  })

  it("ids are stable across locales", () => {
    const enIds = getTemplates("en").map((t) => t.id).sort()
    const jaIds = getTemplates("ja").map((t) => t.id).sort()
    expect(jaIds).toEqual(enIds)
  })

  it("getTemplate throws for unknown id", () => {
    expect(() => getTemplate("nope", "ja")).toThrow(/Unknown template/)
  })

  it("getTemplate returns the requested template", () => {
    const t = getTemplate("research", "en")
    expect(t.id).toBe("research")
  })

  it("default locale is en", () => {
    const t = getTemplate("research") // no locale arg
    expect(t.id).toBe("research")
  })
})
