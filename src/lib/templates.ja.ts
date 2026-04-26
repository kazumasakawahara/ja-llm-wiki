import type { WikiTemplate } from "./templates"
import { TEMPLATES_EN } from "./templates.en"

const BASE_SCHEMA_TYPES_JA = `| entity | wiki/entities/ | 名前のあるもの (人物・ツール・組織・データセット) |
| concept | wiki/concepts/ | 考え方・手法・現象・フレームワーク |
| source | wiki/sources/ | 論文・記事・講演・書籍・ブログ |
| query | wiki/queries/ | 探究中のオープンな問い |
| comparison | wiki/comparisons/ | 関連エンティティの並列比較 |
| synthesis | wiki/synthesis/ | 横断的なまとめ・結論 |
| overview | wiki/ | プロジェクト全体の俯瞰 (1 プロジェクトに 1 つ) |`

const BASE_NAMING_JA = `- ファイル: \`kebab-case.md\`
- エンティティ: 公式名に合わせる (例: \`openai.md\`, \`gpt-4.md\`)
- 概念: 説明的な名詞句 (例: \`chain-of-thought.md\`)
- ソース: \`著者-年-スラッグ.md\` (例: \`wei-2022-cot.md\`)
- クエリ: 質問をスラッグ化 (例: \`does-scale-improve-reasoning.md\`)`

const BASE_FRONTMATTER_JA = `すべてのページに YAML frontmatter を付けます:

\`\`\`yaml
---
type: entity | concept | source | query | comparison | synthesis | overview
title: 人間が読むタイトル
tags: []
related: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
\`\`\`

ソースページにはさらに:
\`\`\`yaml
authors: []
year: YYYY
url: ""
venue: ""
\`\`\``

const BASE_INDEX_FORMAT_JA = `\`wiki/index.md\` は全ページをタイプ別にグループ化して列挙します。各エントリ:
\`\`\`
- [[page-slug]] — 1 行説明
\`\`\``

const BASE_LOG_FORMAT_JA = `\`wiki/log.md\` は新しい順に活動を記録します:
\`\`\`
## YYYY-MM-DD

- 行ったこと/気づいたこと
\`\`\``

const BASE_CROSSREF_JA = `- wiki ページ間のリンクは \`[[page-slug]]\` 構文で行う
- すべての entity・concept は \`wiki/index.md\` に登録する
- query は参照したソースや概念に \`related:\` でリンクする
- synthesis ページは寄与した全ソースを \`related:\` で引用する`

const BASE_CONTRADICTION_JA = `ソース間で矛盾が見つかった場合:
1. 関連する concept または entity ページに矛盾点を記述
2. オープンな問いを追跡する query ページを作成または更新
3. その query ページから両方のソースをリンク
4. 十分な根拠が揃ったら synthesis ページで結論をまとめる`

const researchTemplateJa: WikiTemplate = {
  id: "research",
  name: "リサーチ",
  description: "仮説追跡と方法論ノートを伴う深掘り研究",
  icon: "🔬",
  extraDirs: ["wiki/methodology", "wiki/findings", "wiki/thesis"],
  schema: `# Wiki スキーマ — リサーチ深掘り

## ページタイプ

| Type | Directory | Purpose |
|------|-----------|---------|
${BASE_SCHEMA_TYPES_JA}
| thesis | wiki/thesis/ | 進化していくワーキング仮説 |
| methodology | wiki/methodology/ | 研究手法・プロトコル・実験設計 |
| finding | wiki/findings/ | 個々の経験的結果や観察 |

## 命名規則

${BASE_NAMING_JA}
- thesis: 仮説をスラッグ化 (例: \`scaling-improves-reasoning.md\`)
- methodology: 手法名 (例: \`systematic-review.md\`, \`ablation-study.md\`)
- finding: 説明的なスラッグ (例: \`larger-models-better-few-shot.md\`)

## Frontmatter

${BASE_FRONTMATTER_JA}

thesis ページはさらに:
\`\`\`yaml
confidence: low | medium | high
status: speculative | supported | refuted | settled
\`\`\`

finding ページはさらに:
\`\`\`yaml
source: "[[source-slug]]"
confidence: low | medium | high
replicated: true | false | null
\`\`\`

## Index フォーマット

${BASE_INDEX_FORMAT_JA}

## Log フォーマット

${BASE_LOG_FORMAT_JA}

## 相互参照ルール

${BASE_CROSSREF_JA}
- finding は \`source:\` frontmatter フィールドでソースに紐付ける
- thesis は支持/反証する finding を \`related:\` で参照する
- methodology はそれを使った finding から引用される

## 矛盾の取り扱い

${BASE_CONTRADICTION_JA}

## リサーチ固有の慣習

- thesis ページは生きた文書として証拠が積み上がるごとに更新する
- すべての finding は再現可能性のステータスを (分かる範囲で) 記録する
- methodology ページは「なぜ」(理由) を「どうやって」(手順) と並列に書く
- finding では直接的な証拠と推論を区別する
`,
  purpose: `# プロジェクトの目的 — リサーチ深掘り

## 中心となる問い

<!-- このリサーチが答えようとする中心的な問いを書く。具体的かつ反証可能に。 -->

>

## 仮説 / ワーキングセシス

<!-- 現時点での最良の見立て。証拠が積み上がるにつれて更新していく。 -->

>

## 背景

<!-- どんな先行研究や文脈がこのリサーチを動機づけるか? どのギャップを埋めるか? -->

## サブクエスチョン

<!-- 中心の問いを、扱える単位の小さな問いに分解する。 -->

1.
2.
3.
4.

## スコープ

**対象:**
-

**対象外:**
-

## 方法論

<!-- どう調査するか? どんな種類のソース・実験が関連するか? -->

-

## 成功基準

<!-- 満足できる答えに到達したと判断する基準は? -->

-

## 現在のステータス

> 未着手 — リサーチが進むにつれてこのセクションを更新する。
`,
}

// Tasks 20-23 will replace these EN fallbacks with real Japanese versions.
// Until then, missing-locale fallback to EN keeps users functional.
export const TEMPLATES_JA: WikiTemplate[] = [
  researchTemplateJa,
  ...TEMPLATES_EN.filter((t) => t.id !== "research"),
]
