# Claude Code の機能一覧

## 🎯 できること

### ファイル操作

- ✅ ファイルの読み取り（テキスト、コード、設定ファイルなど）
- ✅ ファイルの作成・書き込み
- ✅ ファイルの編集（部分的な置換、複数箇所の同時編集）
- ✅ ディレクトリ構造の確認（LS）
- ✅ ファイル検索（Glob、Grep）
- ✅ 画像ファイルの表示・認識（PNG、JPG等）
- ✅ Jupyter Notebookの読み書き

### プログラミング支援

- ✅ コードの作成・編集
- ✅ バグの修正
- ✅ リファクタリング
- ✅ テストコードの作成
- ✅ コードレビュー・解説
- ✅ 複数のプログラミング言語対応（Python、JavaScript、TypeScript、Java、C++、Rust等）

### コマンド実行

- ✅ Bashコマンドの実行
- ✅ プログラムの実行（python、node、npm等）
- ✅ Gitコマンドの実行（status、diff、add、commit等）
- ✅ ビルド・テストの実行
- ✅ パッケージ管理（npm、pip等）

### Web関連

- ✅ Webページの取得・解析（WebFetch）
- ✅ Web検索（WebSearch）
- ✅ APIドキュメントの参照
- ✅ HTMLからマークダウンへの変換

### プロジェクト管理

- ✅ TODOリストの作成・管理
- ✅ タスクの進捗追跡
- ✅ Git操作（コミット、ブランチ管理）
- ✅ プルリクエストの作成（GitHub CLI経由）

### AI支援機能

- ✅ 自然言語での指示理解
- ✅ コード生成・補完
- ✅ エラーメッセージの解析・解決策提案
- ✅ ドキュメント作成支援
- ✅ 複雑なタスクの分解・実行

## ❌ できないこと

### システム・環境関連

- ❌ OSレベルの設定変更
- ❌ システムファイルの編集（/etc、/sys等）
- ❌ 新しいソフトウェアのインストール（apt、brew等）
- ❌ カーネルモジュールの操作
- ❌ ネットワーク設定の変更

### GUI・インタラクティブ操作

- ❌ GUIアプリケーションの直接操作
- ❌ インタラクティブなコマンドの実行（vim、nano等のエディタ）
- ❌ 対話型シェル（REPL）の継続的な操作
- ❌ ブラウザの直接操作

### 外部サービス連携

- ❌ 直接的なAPI認証（OAuth等）
- ❌ メール送信
- ❌ データベースへの直接接続（認証が必要な場合）
- ❌ クラウドサービスへの直接アップロード

### リアルタイム・永続的操作

- ❌ リアルタイムモニタリング
- ❌ バックグラウンドプロセスの永続的な実行
- ❌ スケジュールされたタスクの設定（cron等）
- ❌ 長時間実行されるプロセスの管理

### セキュリティ関連

- ❌ パスワードや秘密鍵の生成・管理
- ❌ セキュリティ設定の変更
- ❌ 悪意のあるコードの作成・実行
- ❌ 暗号化されたファイルの復号（鍵なし）

## 💡 使い方のコツ

### 効率的な使い方

1. **明確な指示を出す** - 具体的なタスクや期待する結果を伝える
2. **段階的に進める** - 複雑なタスクは小さなステップに分解
3. **エラーは共有** - エラーメッセージをそのまま見せる
4. **コンテキストを提供** - プロジェクトの背景や制約を説明

### よくある使用例

- 「このエラーを修正して」
- 「〇〇機能を実装して」
- 「テストを書いて」
- 「コードをリファクタリングして」
- 「ドキュメントを作成して」

### CLAUDE.mdの活用

- プロジェクト固有の情報を記載
- よく使うコマンドを記録
- コーディング規約を定義
- 会話スタイルの設定（今回のようにフランクな口調など）

## 🔧 技術的な詳細

### 利用可能なツール

- **Bash** - コマンド実行
- **Read/Write/Edit** - ファイル操作
- **Glob/Grep** - ファイル検索
- **Task** - 複雑な検索や調査
- **TodoRead/TodoWrite** - タスク管理
- **WebFetch/WebSearch** - Web情報取得
- **NotebookRead/NotebookEdit** - Jupyter Notebook操作

### 制限事項

- コマンド実行のタイムアウト: 最大10分
- ファイル読み込み: 一度に最大2000行
- 出力文字数: 30000文字まで
- 同時実行: 複数のツールを並列実行可能

### コストについて

- **Ctrl+R** でセッション内のAPI使用コストが表示される
- **MAXプラン（Proプラン）の場合**:
  - 表示されるコストは参考値（実際の請求には影響しない）
  - 月額料金に使用量が含まれている
  - 追加料金は発生しない
- **平均的な使用量**:
  - 開発者の平均: 1日あたり約$6
  - 90%のユーザー: 1日あたり$12以下
- コスト表示は使用量の把握と透明性のために提供される

## 📝 まとめ

Claude
Codeは開発者の強力なアシスタントとして、コーディング、デバッグ、ドキュメント作成など幅広いタスクをサポートします。ただし、システムレベルの操作やGUIの直接操作など、セキュリティや技術的な理由でできないこともあります。

効果的に使うには、明確な指示と適切なコンテキストの提供が重要です。また、CLAUDE.mdファイルを活用することで、プロジェクト固有の設定や好みを記録し、より効率的な開発が可能になります。
