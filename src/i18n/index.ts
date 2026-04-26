import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import ja from "./ja.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  // App.tsx hydrates the persisted language on startup; this is the
  // pre-hydration default. We fall back through "ja" first because the
  // primary target audience is Japanese users.
  lng: "ja",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18n
