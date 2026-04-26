import { describe, it, expect } from "vitest"
import { isImeConfirm } from "./ime-utils"

describe("isImeConfirm", () => {
  it("returns true when nativeEvent.isComposing is true", () => {
    const fake = { nativeEvent: { isComposing: true }, keyCode: 13 } as never
    expect(isImeConfirm(fake)).toBe(true)
  })

  it("returns true when keyCode === 229 (legacy sentinel)", () => {
    const fake = { nativeEvent: { isComposing: false }, keyCode: 229 } as never
    expect(isImeConfirm(fake)).toBe(true)
  })

  it("returns false when neither signal is set", () => {
    const fake = { nativeEvent: { isComposing: false }, keyCode: 13 } as never
    expect(isImeConfirm(fake)).toBe(false)
  })

  it("returns false for arrow / non-Enter keys (any keyCode)", () => {
    const fake = { nativeEvent: { isComposing: false }, keyCode: 37 } as never
    expect(isImeConfirm(fake)).toBe(false)
  })
})
