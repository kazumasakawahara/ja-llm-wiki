# LLM Wiki

<p align="center">
  <img src="logo.jpg" width="128" height="128" style="border-radius: 22%;" alt="LLM Wiki ロゴ">
</p>

<p align="center">
  <strong>自分自身で育つ、パーソナルナレッジベース。</strong><br>
  LLM がドキュメントを読み込み、構造化された Wiki を構築し、常に最新の状態に保つ。
</p>

<p align="center">
  <a href="#what-is-this">概要</a> •
  <a href="#what-we-changed--added">主な機能</a> •
  <a href="#tech-stack">技術スタック</a> •
  <a href="#installation">インストール</a> •
  <a href="#credits">クレジット</a> •
  <a href="#license">ライセンス</a>
</p>

<p align="center">
  日本語 | <a href="README_EN.md">English</a>
</p>

---

<p align="center">
  <img src="assets/overview.jpg" width="100%" alt="概要">
</p>

## 主な機能

- **2 段階 Chain-of-Thought インジェスト** — LLM がまず分析を行い、その後ソースの追跡可能性とインクリメンタルキャッシュを備えた Wiki ページを生成する
- **4 シグナル知識グラフ** — 直接リンク、ソース重複、Adamic-Adar、タイプ親和性を組み合わせた関連性モデル
- **Louvain コミュニティ検出** — 凝集度スコア付きで知識クラスタを自動的に発見
- **グラフインサイト** — 意外なつながりや知識のギャップをワンクリックの Deep Research で探索可能
- **ベクトル意味検索** — LanceDB によるオプションの埋め込みベース検索。任意の OpenAI 互換エンドポイントに対応
- **永続的なインジェストキュー** — クラッシュリカバリ、キャンセル、リトライ、進捗の可視化を備えた直列処理
- **フォルダインポート** — ディレクトリ構造を保ったまま再帰的にインポートし、フォルダのコンテキストを LLM の分類ヒントとして利用
- **Deep Research** — LLM 最適化された調査トピック、複数クエリでの Web 検索、結果の自動 Wiki 取り込み
- **非同期レビューシステム** — LLM が人間の判断を要する項目をフラグ付け。事前定義されたアクションと事前生成された検索クエリ
- **Chrome Web クリッパー** — ワンクリックで Web ページをキャプチャし、自動的に知識ベースへ取り込み

## 概要

LLM Wiki はクロスプラットフォームのデスクトップアプリケーションであり、手元のドキュメントを整理された相互リンク付きの知識ベースへと自動的に変換する。従来の RAG（毎回ゼロから検索して回答する方式）とは異なり、LLM が **永続的な Wiki をインクリメンタルに構築・維持する**。知識は一度コンパイルされた後は最新の状態に保たれ、クエリごとに再導出されることはない。

このプロジェクトは [Karpathy の LLM Wiki パターン](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — LLM を用いてパーソナルナレッジベースを構築する方法論 — を基礎としている。そのコアアイデアを完全なデスクトップアプリケーションとして実装し、大幅な拡張を加えたものである。

<p align="center">
  <img src="assets/llm_wiki_arch.jpg" width="100%" alt="LLM Wiki アーキテクチャ">
</p>

## クレジット

基礎となる方法論は **Andrej Karpathy** 氏による [llm-wiki.md](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) に由来する。これは LLM を用いてパーソナル Wiki をインクリメンタルに構築・維持するパターンを記述した文書である。原文は抽象的な設計パターンを示したものであり、本プロジェクトはそれを具体的に実装し、大幅に拡張したものである。

## オリジナルから引き継いだもの

コアアーキテクチャは Karpathy 氏の設計に忠実に従っている。

- **3 層アーキテクチャ**: Raw Sources（不変）→ Wiki（LLM 生成）→ Schema（ルール・設定）
- **3 つのコア操作**: Ingest、Query、Lint
- **index.md** をコンテンツカタログ兼 LLM のナビゲーションエントリポイントとする
- **log.md** をパース可能な形式の時系列操作記録とする
- **[[wikilink]]** 構文による相互参照
- すべての Wiki ページに付与される **YAML フロントマター**
- **Obsidian 互換** — Wiki ディレクトリは Obsidian Vault としてそのまま機能する
- **人間がキュレーションし、LLM が維持する** — 役割分担の根本原則

<p align="center">
  <img src="assets/5-obsidian_compatibility.jpg" width="100%" alt="Obsidian 互換性">
</p>

## 変更点と追加点

### 1. CLI からデスクトップアプリへ

オリジナルは LLM エージェントにコピー＆ペーストして使うことを想定した抽象的なパターン文書である。これを **完全なクロスプラットフォームデスクトップアプリケーション** として実装し、以下を備えている。

- **3 カラムレイアウト**: ナレッジツリー / ファイルツリー（左）+ チャット（中央）+ プレビュー（右）
- **アイコンサイドバー** で Wiki、Sources、Search、Graph、Lint、Review、Deep Research、Settings を切り替え
- **カスタムリサイズ可能なパネル** — 最小／最大幅の制約付きで左右パネルをドラッグでリサイズ
- **アクティビティパネル** — ファイル単位のインジェスト進捗をリアルタイム表示
- **すべての状態を永続化** — 会話履歴、設定、レビュー項目、プロジェクト設定が再起動後も保持される
- **シナリオテンプレート** — Research、Reading、Personal Growth、Business、General。各テンプレートは purpose.md と schema.md を事前設定する

### 2. Purpose.md — Wiki の魂

オリジナルには Schema（Wiki がどう動くか）はあるが、**なぜ** Wiki が存在するのかを定義する正式な場所が存在しなかった。本プロジェクトでは `purpose.md` を追加した。

- 目標、主要な問い、研究範囲、進化していくテーゼを定義する
- LLM はインジェストおよびクエリのたびに purpose.md を読み、コンテキストとして利用する
- 利用パターンに基づいて LLM が更新を提案できる
- Schema との違い — Schema は構造的なルール、purpose は方向性としての意図

### 3. 2 段階 Chain-of-Thought インジェスト

オリジナルは LLM が読みながら同時に書く 1 段階のインジェストを記述している。本プロジェクトではこれを **2 つの逐次的な LLM 呼び出し** に分割し、品質を大幅に改善した。

```
Step 1 (Analysis): LLM reads source → structured analysis
  - Key entities, concepts, arguments
  - Connections to existing wiki content
  - Contradictions & tensions with existing knowledge
  - Recommendations for wiki structure

Step 2 (Generation): LLM takes analysis → generates wiki files
  - Source summary with frontmatter (type, title, sources[])
  - Entity pages, concept pages with cross-references
  - Updated index.md, log.md, overview.md
  - Review items for human judgment
  - Search queries for Deep Research
```

オリジナルにはないインジェスト関連の追加機能は以下のとおりである。

- **SHA256 インクリメンタルキャッシュ** — インジェスト前にソースファイルの内容をハッシュ化し、未変更のファイルは自動的にスキップして LLM のトークンと時間を節約する
- **永続的なインジェストキュー** — 同時 LLM 呼び出しを防ぐ直列処理。キューはディスクに永続化され、アプリ再起動後も維持される。失敗したタスクは最大 3 回まで自動でリトライされる
- **フォルダインポート** — ディレクトリ構造を保ったまま再帰的にインポート。フォルダパスは LLM に分類コンテキストとして渡される（例: 「papers > energy」がコンテンツ分類の手助けとなる）
- **キューの可視化** — アクティビティパネルにプログレスバーと、キャンセル／リトライボタン付きで pending／processing／failed のタスクを表示
- **自動埋め込み** — ベクトル検索が有効な場合、新規ページはインジェスト後に自動で埋め込まれる
- **ソースの追跡可能性** — 生成されたすべての Wiki ページの YAML フロントマターに `sources: []` フィールドが含まれ、寄与した raw ソースファイルへ遡及できる
- **overview.md の自動更新** — 最新の Wiki 状態を反映するため、インジェストのたびにグローバルなサマリーページが再生成される
- **ソースサマリーの保証** — LLM が省略した場合でも、ソースサマリーページが必ず作成されるフォールバックを備える
- **言語認識生成** — ユーザーが設定した言語（英語または中国語）で LLM が応答する

### 4. 関連性モデルを備えた知識グラフ

<p align="center">
  <img src="assets/3-knowledge_graph.jpg" width="100%" alt="知識グラフ">
</p>

オリジナルは相互参照のための `[[wikilinks]]` に言及するのみで、グラフ解析は持たない。本プロジェクトでは **完全な知識グラフ可視化と関連性エンジン** を構築した。

**4 シグナル関連性モデル:**
| シグナル | 重み | 説明 |
|--------|--------|-------------|
| Direct link | ×3.0 | `[[wikilinks]]` で直接リンクされたページ |
| Source overlap | ×4.0 | 同一の raw ソースを共有するページ（フロントマター `sources[]` 経由） |
| Adamic-Adar | ×1.5 | 共通の隣接ノードを共有するページ（隣接ノードの次数で重み付け） |
| Type affinity | ×1.0 | 同一ページタイプ（entity↔entity、concept↔concept）に対するボーナス |

**グラフ可視化（sigma.js + graphology + ForceAtlas2）:**
- ノード色はページタイプまたはコミュニティで決まり、サイズはリンク数（√ スケーリング）に応じて変化する
- エッジの太さと色は関連性の重みを表す（緑=強い、灰色=弱い）
- ホバー時のインタラクション: 隣接ノードは表示されたまま、非隣接ノードは暗くなり、エッジは関連度スコアラベル付きでハイライト表示される
- ズームコントロール（ズームイン、ズームアウト、画面フィット）
- 位置キャッシュにより、データ更新時のレイアウトの飛びを防止
- カラーリングモードに応じて、凡例がタイプ件数とコミュニティ情報を切り替え表示

### 5. Louvain コミュニティ検出

オリジナルにはない機能。**Louvain アルゴリズム**（graphology-communities-louvain）を用いて知識クラスタを自動発見する。

- **自動クラスタリング** — 事前定義されたページタイプとは独立に、リンクトポロジーから自然にグループ化されるページを発見
- **タイプ／コミュニティ切り替え** — ノードの色をページタイプ（entity、concept、source など）または発見されたナレッジクラスタで切り替え可能
- **凝集度スコアリング** — 各コミュニティを内部エッジの密度（実エッジ数 / 可能エッジ数）でスコアリング。低凝集度のクラスタ（< 0.15）は警告フラグ付き
- **12 色パレット** — クラスタ間の視覚的な区別を明確化
- **コミュニティ凡例** — クラスタごとに代表ノードのラベル、メンバー数、凝集度を表示

<p align="center">
  <img src="assets/kg_community.jpg" width="100%" alt="Louvain コミュニティ検出">
</p>

### 6. グラフインサイト — 意外なつながりと知識のギャップ

オリジナルにはない機能。本システムはグラフ構造を **自動的に解析** し、実用的なインサイトを抽出する。

**意外なつながり:**
- 想定外の関係を検出する: コミュニティをまたぐエッジ、タイプをまたぐリンク、周辺ノード↔ハブの結合
- 複合的な「意外度スコア」によって、特に注目すべきつながりを順位付け
- ディスマイス可能 — レビュー済みとマークしたつながりは再表示されない

**知識のギャップ:**
- **孤立ページ**（次数 ≤ 1） — Wiki の他の部分とほとんど、あるいは全く接続のないページ
- **疎なコミュニティ**（凝集度 < 0.15、ページ数 ≥ 3） — 内部の相互参照が弱い知識領域
- **ブリッジノード**（3 つ以上のクラスタを接続） — 複数の知識領域を結びつける重要な結節点となるページ

**インタラクティブ:**
- インサイトカードをクリックすると、対応するノードとエッジがグラフ上で **ハイライト** される。再度クリックすると選択解除される
- 知識のギャップやブリッジノードには **Deep Research ボタン** があり、ドメインを意識したトピックで LLM 最適化された調査を起動する（コンテキストとして overview.md と purpose.md を読む）
- 調査トピックは開始前に **編集可能な確認ダイアログ** に表示され、ユーザーがトピックや検索クエリを調整できる

<p align="center">
  <img src="assets/kg_insights.jpg" width="100%" alt="グラフインサイト">
</p>

### 7. 最適化されたクエリ検索パイプライン

オリジナルは LLM が関連ページを読むだけのシンプルなクエリを記述している。本プロジェクトでは、オプションのベクトル検索と予算制御を備えた **多段階の検索パイプライン** を構築した。

```
Phase 1: Tokenized Search
  - English: word splitting + stop word removal
  - Chinese: CJK bigram tokenization (每个 → [每个, 个…])
  - Title match bonus (+10 score)
  - Searches both wiki/ and raw/sources/

Phase 1.5: Vector Semantic Search (optional)
  - Embedding via any OpenAI-compatible /v1/embeddings endpoint
  - Stored in LanceDB (Rust backend) for fast ANN retrieval
  - Cosine similarity finds semantically related pages even without keyword overlap
  - Results merged into search: boosts existing matches + adds new discoveries

Phase 2: Graph Expansion
  - Top search results used as seed nodes
  - 4-signal relevance model finds related pages
  - 2-hop traversal with decay for deeper connections

Phase 3: Budget Control
  - Configurable context window: 4K → 1M tokens
  - Proportional allocation: 60% wiki pages, 20% chat history, 5% index, 15% system
  - Pages prioritized by combined search + graph relevance score

Phase 4: Context Assembly
  - Numbered pages with full content (not just summaries)
  - System prompt includes: purpose.md, language rules, citation format, index.md
  - LLM instructed to cite pages by number: [1], [2], etc.
```

**ベクトル検索** は完全にオプションである。デフォルトでは無効化されており、Settings から独立したエンドポイント、API キー、モデル設定で有効化できる。無効時にはトークン化検索 + グラフ拡張にフォールバックする。ベンチマークでは、ベクトル検索を有効化することで全体的な再現率が 58.2% から 71.4% に向上した。

### 8. 永続化対応のマルチ会話チャット

オリジナルはシングルクエリインターフェースのみである。本プロジェクトでは **完全なマルチ会話サポート** を構築した。

- **独立したチャットセッション** — 会話の作成、リネーム、削除
- **会話サイドバー** — トピック間を素早く切り替え
- **会話単位の永続化** — 各会話は `.llm-wiki/chats/{id}.json` に保存される
- **履歴深度の設定可能** — コンテキストとして送信するメッセージ数を制限可能（デフォルト: 10）
- **引用参照パネル** — 各レスポンスに、利用された Wiki ページをタイプ別アイコン付きでまとめた折りたたみ可能なセクションを表示
- **参照の永続化** — 引用されたページはメッセージデータに直接保存され、再起動後も安定して保持される
- **再生成** — 直前のレスポンスをワンクリックで再生成（直前の assistant + user メッセージペアを削除し再送信）
- **Wiki への保存** — 価値ある回答を `wiki/queries/` にアーカイブし、その後自動的にインジェストして、エンティティや概念を知識ネットワークへ抽出する

### 9. Thinking / Reasoning の表示

オリジナルにはない機能。`<think>` ブロックを出力する LLM（DeepSeek、QwQ など）に対応する。

- **ストリーミング Thinking** — 生成中は不透明度フェード付きで 5 行のローリング表示
- **デフォルトで折りたたみ** — Thinking ブロックは生成完了後は隠され、クリックで展開
- **視覚的な分離** — Thinking の内容はメインレスポンスとは異なるスタイルで表示

### 10. KaTeX による数式レンダリング

オリジナルにはない機能。すべてのビューにわたる完全な LaTeX 数式サポート。

- **KaTeX レンダリング** — インラインの `$...$` とブロックの `$$...$$` の数式を remark-math + rehype-katex で描画
- **Milkdown の数式プラグイン** — プレビューエディタが @milkdown/plugin-math 経由でネイティブに数式を描画
- **自動検出** — 裸の `\begin{aligned}` などの LaTeX 環境は自動的に `$$` デリミタでラップされる
- **Unicode フォールバック** — 数式ブロック外のシンプルなインライン記法のために 100 以上のシンボルマッピング（α、∑、→、≤ など）を提供

### 11. レビューシステム（非同期 Human-in-the-Loop）

オリジナルはインジェスト中に人間が関与し続けることを推奨している。本プロジェクトでは **非同期レビューキュー** を追加した。

- LLM がインジェスト中に人間の判断を要する項目をフラグ付けする
- **事前定義されたアクションタイプ**: Create Page、Deep Research、Skip — 任意のアクションが LLM のハルシネーションで生成されないよう制限
- **インジェスト時に検索クエリを生成** — 各レビュー項目について LLM が事前に最適化された Web 検索クエリを生成
- ユーザーは都合の良いタイミングでレビューを処理可能 — インジェストをブロックしない

### 12. Deep Research

<p align="center">
  <img src="assets/1-deepresearch.jpg" width="100%" alt="Deep Research">
</p>

オリジナルにはない機能。LLM が知識のギャップを特定したときに動作する。

- **Web 検索**（Tavily API）— 関連ソースを発見し、本文を完全抽出（切り詰めなし）
- **トピックごとに複数の検索クエリ** — インジェスト時に LLM が生成し、検索エンジン向けに最適化される
- **LLM 最適化された調査トピック** — Graph Insights から起動した場合、LLM は overview.md と purpose.md を読み、ドメインに特化したトピックとクエリを生成する（汎用キーワードではない）
- **ユーザー確認ダイアログ** — 調査開始前に編集可能なトピックと検索クエリを表示
- **LLM が成果物を統合** — Wiki の研究ページとしてまとめ、既存の Wiki への相互参照を付与
- **Thinking 表示** — `<think>` ブロックは統合中に折りたたみ可能なセクションとして表示され、最新内容まで自動スクロールする
- **自動インジェスト** — 調査結果は自動的に処理され、エンティティ／概念が Wiki に抽出される
- **タスクキュー** — 同時実行 3 タスク
- **Research パネル** — 動的な高さを持ち、進捗をリアルタイムでストリーミング表示する専用サイドバーパネル

### 13. ブラウザ拡張機能（Web クリッパー）

<p align="center">
  <img src="assets/4-chrome_extension_webclipper.jpg" width="100%" alt="Chrome 拡張機能 Web クリッパー">
</p>

オリジナルは Obsidian Web Clipper に言及している。本プロジェクトでは **専用の Chrome 拡張機能**（Manifest V3）を構築した。

- **Mozilla Readability.js** による正確な記事抽出（広告、ナビゲーション、サイドバーを除去）
- **Turndown.js** による HTML → Markdown 変換（テーブル対応）
- **プロジェクトピッカー** — クリップ先の Wiki を選択可能（マルチプロジェクト対応）
- **ローカル HTTP API**（ポート 19827、tiny_http） — 拡張機能 ↔ アプリ間の通信
- **自動インジェスト** — クリップしたコンテンツが自動的に 2 段階インジェストパイプラインを起動
- **Clip ウォッチャー** — 3 秒ごとに新しいクリップをポーリングし、自動的に処理
- **オフラインプレビュー** — アプリが起動していない状態でも抽出済みコンテンツを表示

### 14. マルチフォーマットドキュメント対応

オリジナルはテキスト／Markdown が中心である。本プロジェクトでは、ドキュメントのセマンティクスを保ったまま構造化抽出をサポートする。

| 形式 | 抽出方法 |
|--------|--------|
| PDF | pdf-extract（Rust）、ファイルキャッシュ付き |
| DOCX | docx-rs — 見出し、太字／斜体、リスト、テーブル → 構造化 Markdown |
| PPTX | ZIP + XML — 見出し／リスト構造を保ったままスライド単位で抽出 |
| XLSX/XLS/ODS | calamine — 適切なセル型、複数シート対応、Markdown テーブル |
| 画像 | ネイティブプレビュー（png、jpg、gif、webp、svg など） |
| 動画／音声 | 内蔵プレイヤー |
| Web クリップ | Readability.js + Turndown.js → クリーンな Markdown |

### 15. カスケード削除を伴うファイル削除

オリジナルには削除機構がない。本プロジェクトでは **インテリジェントなカスケード削除** を追加した。

- ソースファイルを削除すると、その Wiki サマリーページも削除される
- **3 種類のマッチング手法** で関連 Wiki ページを検出する: フロントマター `sources[]` フィールド、ソースサマリーページ名、フロントマター内のセクション参照
- **共有エンティティの保護** — 複数のソースにリンクされた entity／concept ページは、削除されたソースだけが `sources[]` 配列から除去され、ページ自体は削除されない
- **Index のクリーンアップ** — 削除されたページは index.md からも除去される
- **Wikilink のクリーンアップ** — 削除されたページへの不要な `[[wikilinks]]` は、残りの Wiki ページから取り除かれる

### 16. 設定可能なコンテキストウィンドウ

オリジナルにはない機能。LLM が受け取るコンテキストの量をユーザーが設定できる。

- **4K から 1M トークンまでのスライダー** — さまざまな LLM の能力に適合
- **比例配分のバジェット割り当て** — ウィンドウが大きいほど、より多くの Wiki コンテンツが比例して割り当てられる
- **60/20/5/15 分割** — Wiki ページ / チャット履歴 / Index / システムプロンプト

### 17. クロスプラットフォーム対応

オリジナルはプラットフォームに依存しない（抽象的なパターン）。本プロジェクトでは具体的なクロスプラットフォーム上の課題に対処する。

- **パスの正規化** — 22 以上のファイルで使用される統一された `normalizePath()`、バックスラッシュ → スラッシュ変換
- **Unicode セーフな文字列処理** — バイトベースではなく文字ベースのスライス（CJK ファイル名でのクラッシュを防止）
- **macOS の close-to-hide** — クローズボタンでウィンドウを非表示（アプリはバックグラウンドで継続）。Dock アイコンクリックで復元、Cmd+Q で終了
- **Windows／Linux のクローズ確認** — 終了前に確認ダイアログを表示し、誤操作によるデータ損失を防止
- **Tauri v2** — macOS、Windows、Linux のネイティブデスクトップ
- **GitHub Actions CI/CD** — macOS（ARM + Intel）、Windows（.msi）、Linux（.deb / .AppImage）の自動ビルド

### 18. その他の追加機能

- **i18n** — 英語 + 中国語のインターフェース（react-i18next）
- **設定の永続化** — LLM プロバイダ、API キー、モデル、コンテキストサイズ、言語が Tauri Store 経由で保存される
- **Obsidian 設定** — 推奨設定を含む `.obsidian/` ディレクトリを自動生成
- **Markdown レンダリング** — 罫線付きの GFM テーブル、適切なコードブロック、チャットおよびプレビュー上での Wikilink 処理
- **マルチプロバイダ LLM 対応** — OpenAI、Anthropic、Google、Ollama、Custom — それぞれプロバイダ固有のストリーミングとヘッダーに対応
- **15 分のタイムアウト** — 長時間のインジェスト操作が早期失敗しないようにする
- **dataVersion シグナル** — Wiki コンテンツが変更されると、グラフと UI が自動的に再描画される

## 技術スタック

| レイヤー | 技術 |
|-------|-----------|
| Desktop | Tauri v2（Rust バックエンド） |
| Frontend | React 19 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS v4 |
| Editor | Milkdown（ProseMirror ベースの WYSIWYG） |
| Graph | sigma.js + graphology + ForceAtlas2 |
| Search | トークン化検索 + グラフ関連性 + オプションのベクトル検索（LanceDB） |
| Vector DB | LanceDB（Rust 製、組み込み、オプション） |
| PDF | pdf-extract |
| Office | docx-rs + calamine |
| i18n | react-i18next |
| State | Zustand |
| LLM | ストリーミング fetch（OpenAI、Anthropic、Google、Ollama、Custom） |
| Web Search | Tavily API |

## インストール

### ビルド済みバイナリ

[Releases](https://github.com/nashsu/llm_wiki/releases) からダウンロードできる。
- **macOS**: `.dmg`（Apple Silicon + Intel）
- **Windows**: `.msi`
- **Linux**: `.deb` / `.AppImage`

### ソースからのビルド

```bash
# Prerequisites: Node.js 20+, Rust 1.70+
git clone https://github.com/nashsu/llm_wiki.git
cd llm_wiki
npm install
npm run tauri dev      # Development
npm run tauri build    # Production build
```

### Chrome 拡張機能

1. `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化する
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `extension/` ディレクトリを選択する

## クイックスタート

1. アプリを起動 → 新規プロジェクトを作成（テンプレートを選択）
2. **Settings** へ移動 → LLM プロバイダを設定（API キー + モデル）
3. **Sources** へ移動 → ドキュメント（PDF、DOCX、MD など）をインポート
4. **アクティビティパネル** を確認 — LLM が自動的に Wiki ページを構築する
5. **Chat** で知識ベースに対して質問する
6. **知識グラフ** を眺めてつながりを把握する
7. **Review** で対応の必要な項目を確認する
8. **Lint** を定期的に実行して Wiki の健全性を保つ

> 初めて使う方は、ステップごとの詳しい手順や日本語形態素解析・Obsidian 併用などをまとめた [日本語ユーザーマニュアル (MANUAL_JA.md)](MANUAL_JA.md) も参照してください。

## プロジェクト構成

```
my-wiki/
├── purpose.md              # Goals, key questions, research scope
├── schema.md               # Wiki structure rules, page types
├── raw/
│   ├── sources/            # Uploaded documents (immutable)
│   └── assets/             # Local images
├── wiki/
│   ├── index.md            # Content catalog
│   ├── log.md              # Operation history
│   ├── overview.md         # Global summary (auto-updated)
│   ├── entities/           # People, organizations, products
│   ├── concepts/           # Theories, methods, techniques
│   ├── sources/            # Source summaries
│   ├── queries/            # Saved chat answers + research
│   ├── synthesis/          # Cross-source analysis
│   └── comparisons/        # Side-by-side comparisons
├── .obsidian/              # Obsidian vault config (auto-generated)
└── .llm-wiki/              # App config, chat history, review items
```

## Star History

<a href="https://www.star-history.com/?repos=nashsu%2Fllm_wiki&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=nashsu/llm_wiki&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=nashsu/llm_wiki&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=nashsu/llm_wiki&type=date&legend=top-left" />
 </picture>
</a>

## ライセンス

本プロジェクトは **GNU General Public License v3.0** の下でライセンスされる — 詳細は [LICENSE](LICENSE) を参照のこと。
