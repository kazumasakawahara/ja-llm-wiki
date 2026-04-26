import type { KeyboardEvent } from "react"

/**
 * True when the keyboard event represents an IME confirmation key press
 * rather than a real "Enter" the app should react to.
 *
 * Combine with the usual `e.key === "Enter" && !e.shiftKey` outer guard:
 *
 *   if (e.key === "Enter" && !e.shiftKey) {
 *     if (isImeConfirm(e)) return       // skip — user is just confirming a kana → kanji conversion
 *     e.preventDefault()
 *     onSend()
 *   }
 *
 * Why both signals: macOS Kotoeri reports `keyCode === 229` for the final
 * Enter while the modern `isComposing` flag has already flipped to false.
 * Chrome / WebView2 / Firefox usually report `isComposing` reliably. We
 * check both so all major IMEs behave correctly.
 */
export function isImeConfirm<E extends Element>(e: KeyboardEvent<E>): boolean {
  return e.nativeEvent.isComposing || e.keyCode === 229
}
