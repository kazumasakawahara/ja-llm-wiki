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

## 仮説 / 暫定セシス (working thesis)

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

const readingTemplateJa: WikiTemplate = {
  id: "reading",
  name: "読書",
  description: "登場人物・テーマ・プロット・章ごとのメモを記録する",
  icon: "📚",
  extraDirs: ["wiki/characters", "wiki/themes", "wiki/plot-threads", "wiki/chapters"],
  schema: `# Wiki スキーマ — 読書

## ページタイプ

| Type | Directory | Purpose |
|------|-----------|---------|
${BASE_SCHEMA_TYPES_JA}
| character | wiki/characters/ | 作中の人物 |
| theme | wiki/themes/ | 繰り返されるアイデア・モチーフ・象徴 |
| plot-thread | wiki/plot-threads/ | 追跡する物語のストーリーラインや弧 |
| chapter | wiki/chapters/ | 章ごとのメモと要約 |

## 命名規則

${BASE_NAMING_JA}
- character: 人物名を kebab-case (例: \`elizabeth-bennet.md\`)
- theme: テーマ的な名詞句 (例: \`social-class-mobility.md\`, \`deception-vs-honesty.md\`)
- plot-thread: 弧の説明 (例: \`darcys-redemption-arc.md\`)
- chapter: \`ch-NN-slug.md\` (例: \`ch-01-opening-scene.md\`)

## Frontmatter

${BASE_FRONTMATTER_JA}

character ページはさらに:
\`\`\`yaml
first_appearance: "Ch. N"
role: protagonist | antagonist | supporting | minor
\`\`\`

chapter ページはさらに:
\`\`\`yaml
chapter: N
pages: "1-24"
\`\`\`

## Index フォーマット

${BASE_INDEX_FORMAT_JA}

## Log フォーマット

${BASE_LOG_FORMAT_JA}

## 相互参照ルール

${BASE_CROSSREF_JA}
- chapter のメモは登場人物を \`related:\` で参照する
- theme ページは、そのテーマが顕著な章にリンクする
- plot-thread ページは、その弧を進めた章を列挙する

## 矛盾の取り扱い

${BASE_CONTRADICTION_JA}

## 読書固有の慣習

- chapter ページは読書中または読了直後に書く — 鮮度のある反応を捉える
- chapter のメモではプロット要約と個人的な解釈を区別する
- theme ページは「テーマが存在する」と書くだけでなく、本全体での*展開*を追跡する
- 未解決のプロットは \`status: open\` で明記する
- 重要な引用は再発見できるようにページ番号をメモする
`,
  purpose: `# プロジェクトの目的 — 読書

## 書誌情報

**タイトル:**
**著者:**
**刊行年:**
**ジャンル:**

## なぜこの本を読むのか

<!-- 何に惹かれたか? この本から何を得たいか? -->

## 追跡したい主要テーマ

<!-- 期待する/追いたいテーマの線は? -->

1.
2.
3.

## 読み始める前の問い

<!-- 読了時に答えが欲しい/掘り下げたい問いは? -->

1.
2.

## 読書ペース

**開始日:**
**目標完了日:**
**現在の章:**

## 第一印象

<!-- 最初の章または最初の読書セッション後に更新。 -->

>

## 最終的な学び

<!-- 読了後に書く。本のメッセージは何だったか? -->

>
`,
}

const personalTemplateJa: WikiTemplate = {
  id: "personal",
  name: "自己成長",
  description: "目標・習慣・振り返り・ジャーナルを記録して自己改善を進める",
  icon: "🌱",
  extraDirs: ["wiki/goals", "wiki/habits", "wiki/reflections", "wiki/journal"],
  schema: `# Wiki スキーマ — 自己成長

## ページタイプ

| Type | Directory | Purpose |
|------|-----------|---------|
${BASE_SCHEMA_TYPES_JA}
| goal | wiki/goals/ | 取り組んでいる具体的な成果(目標) |
| habit | wiki/habits/ | 繰り返し行う行動とその記録(習慣) |
| reflection | wiki/reflections/ | 定期的なレビューと得られた学び(振り返り) |
| journal | wiki/journal/ | 日々のフリーフォームな記録(ジャーナル) |

## 命名規則

${BASE_NAMING_JA}
- goal: 成果をスラッグ化 (例: \`run-a-marathon.md\`, \`learn-spanish.md\`)
- habit: 行動名 (例: \`daily-meditation.md\`, \`morning-pages.md\`)
- reflection: 種別 + 日付 (例: \`weekly-2024-03.md\`, \`quarterly-2024-q1.md\`)
- journal: 日付スラッグ (例: \`2024-03-15.md\`)

## Frontmatter

${BASE_FRONTMATTER_JA}

goal ページはさらに:
\`\`\`yaml
target_date: YYYY-MM-DD
status: active | paused | achieved | abandoned
progress: 0-100
\`\`\`

habit ページはさらに:
\`\`\`yaml
frequency: daily | weekly | monthly
streak: N
status: active | paused | dropped
\`\`\`

reflection ページはさらに:
\`\`\`yaml
period: weekly | monthly | quarterly | annual
\`\`\`

## Index フォーマット

${BASE_INDEX_FORMAT_JA}

## Log フォーマット

${BASE_LOG_FORMAT_JA}

## 相互参照ルール

${BASE_CROSSREF_JA}
- reflection ページはその期間にレビューした goal や habit を参照する
- goal は支えとなる habit を \`related:\` でリンクする
- journal エントリは本文中で \`[[slug]]\` を使って goal や reflection を参照できる

## 矛盾の取り扱い

${BASE_CONTRADICTION_JA}

## 自己成長固有の慣習

- journal や reflection には正直に書く — この wiki は他人ではなく自分のためのものである
- goal の進捗フィールドは定期的に更新する。古いままのデータは無いより悪い
- 成果目標(何を得たいか)とプロセス目標(何をするか)を区別する
- 習慣がうまくいった/いかなかった事実だけでなく、*なぜ*そうなったかを振り返る
- 複数の goal や期間にまたがる横断的な気づきは synthesis ディレクトリに書く
`,
  purpose: `# プロジェクトの目的 — 自己成長

## 注力領域

<!-- 今、自分のどの領域・どの側面に積極的に取り組んでいますか? -->

1.
2.
3.

## 動機

<!-- なぜ今なのか? この wiki を始めたきっかけは何ですか? -->

## 現在の目標 (サマリー)

<!-- ハイレベルな一覧 — 詳細な goal ページは wiki/goals/ に作成する -->

- [ ]
- [ ]
- [ ]

## 取り組み中の習慣

<!-- ハイレベルな一覧 — 詳細な habit ページは wiki/habits/ に作成する -->

-
-

## レビューの頻度

**毎日のジャーナル:** はい / いいえ
**週次の振り返り:**
**月次の振り返り:**
**四半期の振り返り:**

## 指針となる原則

<!-- 自己成長の取り組みを導く価値観や原則は何ですか? -->

1.
2.
3.

## 今年のテーマ

<!-- 今年の意図を表す一語または一文。 -->

>
`,
}

const businessTemplateJa: WikiTemplate = {
  id: "business",
  name: "ビジネス",
  description: "チームのミーティング・意思決定・プロジェクト・ステークホルダーの文脈を管理する",
  icon: "💼",
  extraDirs: ["wiki/meetings", "wiki/decisions", "wiki/projects", "wiki/stakeholders"],
  schema: `# Wiki スキーマ — ビジネス / チーム

## ページタイプ

| Type | Directory | Purpose |
|------|-----------|---------|
${BASE_SCHEMA_TYPES_JA}
| meeting | wiki/meetings/ | ミーティングノート・アジェンダ・アクションアイテム |
| decision | wiki/decisions/ | アーキテクチャ上または戦略上の意思決定 (ADR 形式) |
| project | wiki/projects/ | プロジェクトのブリーフ・状況・振り返り |
| stakeholder | wiki/stakeholders/ | 関与する人物・チーム・組織 |

## 命名規則

${BASE_NAMING_JA}
- meeting: \`YYYY-MM-DD-slug.md\` (例: \`2024-03-15-sprint-planning.md\`)
- decision: \`NNN-slug.md\` (例: \`001-adopt-typescript.md\`)
- project: 説明的なスラッグ (例: \`payments-redesign.md\`)
- stakeholder: 氏名またはチーム名を kebab-case で (例: \`alice-chen.md\`, \`platform-team.md\`)

## Frontmatter

${BASE_FRONTMATTER_JA}

meeting ページはさらに:
\`\`\`yaml
date: YYYY-MM-DD
attendees: []
action_items: []
\`\`\`

decision ページはさらに:
\`\`\`yaml
status: proposed | accepted | deprecated | superseded
deciders: []
date: YYYY-MM-DD
supersedes: ""   # 置き換え対象の ADR スラッグ (該当する場合)
\`\`\`

project ページはさらに:
\`\`\`yaml
status: planned | active | on-hold | complete | cancelled
owner: ""
start_date: YYYY-MM-DD
target_date: YYYY-MM-DD
\`\`\`

## Index フォーマット

${BASE_INDEX_FORMAT_JA}

## Log フォーマット

${BASE_LOG_FORMAT_JA}

## 相互参照ルール

${BASE_CROSSREF_JA}
- meeting ノートは出席者を \`attendees:\` frontmatter および \`[[stakeholder-slug]]\` リンクで参照する
- decision ページは、その意思決定が議論された meeting にリンクする
- project ページは関連する重要な decision を \`related:\` でリンクする
- stakeholder ページは、その人物が関わる project と decision を列挙する

## 矛盾の取り扱い

${BASE_CONTRADICTION_JA}

## ビジネス固有の慣習

- ミーティングノートは開催中または 24 時間以内に書く — 記憶はすぐに薄れる
- アクションアイテムには担当者と期限を明記する。両方が無いと実行されない
- decision ページは決定内容だけでなく*文脈と帰結*を残す
- 廃止された decision は、それを置き換えた decision にリンクする
- project は完了時に振り返りセクションを追記する
`,
  purpose: `# プロジェクトの目的 — ビジネス / チーム

## ビジネス文脈

**組織 / チーム:**
**ドメイン:**
**対象期間:**

## 目的 (Objectives)

<!-- この wiki が支える、トップレベルのビジネス目的は何か? -->

1.
2.
3.

## 主要プロジェクト

<!-- ハイレベルな一覧 — 詳細な project ページは wiki/projects/ に作成する -->

-
-

## 主要ステークホルダー

<!-- 関与する主要な人物やチームは? -->

-
-

## 進行中の意思決定

<!-- 現在検討中の意思決定 — ADR ページは wiki/decisions/ に作成する -->

-
-

## 指標 / 成功基準

<!-- 目的に向けた進捗をチームはどう測るか? -->

-

## 制約とリスク

<!-- 既知の制約 (予算・時間・組織) と追跡すべきリスク -->

-

## レビューの頻度

**週次同期ノート:**
**月次ステータス更新:**
**四半期レトロスペクティブ:**
`,
}

export const TEMPLATES_JA: WikiTemplate[] = [
  researchTemplateJa,
  readingTemplateJa,
  personalTemplateJa,
  businessTemplateJa,
  ...TEMPLATES_EN.filter(
    (t) => t.id !== "research" && t.id !== "reading" && t.id !== "personal" && t.id !== "business",
  ),
]
