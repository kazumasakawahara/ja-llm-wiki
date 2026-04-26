# Changelog

## v0.4.0 — 2026-04-26

### Breaking changes
- 中国語 (zh) UI とドキュメントを廃止しました。既存の zh ユーザーは英語または日本語に自動フォールバックします。
- `OutputLanguage` から `"Chinese"` および `"Traditional Chinese"` を削除しました。古い設定値はアプリ起動時に `"auto"` にリセットされます。

### Added
- 日本語 UI 全面対応 (`src/i18n/ja.json`)。
- OS ロケール検出による初回起動時の自動言語選択。
- 検索クエリの日本語形態素解析:
  - 既定: 軽量な `Intl.Segmenter`
  - 高精度: Lindera (MeCab 互換、IPAdic 同梱) を Settings から選択可能
- プロジェクトテンプレート (Research / Reading / Personal Growth / Business / General) を全件日本語化。
- 日本語 README (`README_JA.md`) を追加。
- IME 確定キー (Enter) を共通ヘルパ `isImeConfirm` に集約し、全テキスト入力欄に適用。
- LLM 出力指示の日本語特化ガイドライン (カタカナ表記・文体・引用書式)。

### Fixed
- IME 確定中の Enter キーがチャット入力を誤送信するバグを修正 (`isComposing` と keyCode 229 の両方をガード)。
- `wiki-filename` の slug 生成は変更なし (もとから Unicode 対応)、ドキュメントを実装に合わせて訂正。

### Removed
- `README_CN.md`
- `src/i18n/zh.json`
- 検索クエリの CJK bigram フォールバック (中国語専用パスを削除)
