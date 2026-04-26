// @vitest-environment happy-dom
import { afterEach, describe, it, expect, vi } from "vitest"
import { render, fireEvent, cleanup } from "@testing-library/react"
import { ChatInput } from "./chat-input"

afterEach(() => {
  cleanup()
})

describe("ChatInput IME handling", () => {
  it("does NOT send on Enter while IME is composing (isComposing=true)", () => {
    const onSend = vi.fn()
    const { getByRole } = render(
      <ChatInput onSend={onSend} onStop={() => {}} isStreaming={false} />,
    )
    const ta = getByRole("textbox") as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: "こんにちは" } })

    fireEvent.keyDown(ta, { key: "Enter", isComposing: true })
    expect(onSend).not.toHaveBeenCalled()
  })

  it("does NOT send on keyCode 229 (legacy IME sentinel)", () => {
    const onSend = vi.fn()
    const { getByRole } = render(
      <ChatInput onSend={onSend} onStop={() => {}} isStreaming={false} />,
    )
    const ta = getByRole("textbox") as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: "こんにちは" } })

    fireEvent.keyDown(ta, { key: "Enter", keyCode: 229 })
    expect(onSend).not.toHaveBeenCalled()
  })

  it("DOES send on Enter when not composing", () => {
    const onSend = vi.fn()
    const { getByRole } = render(
      <ChatInput onSend={onSend} onStop={() => {}} isStreaming={false} />,
    )
    const ta = getByRole("textbox") as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: "hello" } })

    fireEvent.keyDown(ta, { key: "Enter", isComposing: false })
    expect(onSend).toHaveBeenCalledWith("hello")
  })

  it("does NOT send on Shift+Enter (newline)", () => {
    const onSend = vi.fn()
    const { getByRole } = render(
      <ChatInput onSend={onSend} onStop={() => {}} isStreaming={false} />,
    )
    const ta = getByRole("textbox") as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: "hello" } })

    fireEvent.keyDown(ta, { key: "Enter", shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
  })
})
