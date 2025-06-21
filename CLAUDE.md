# Claude Code Playground プロジェクト情報

## プロジェクト概要

Claude Codeの機能をテストするための開発環境です。

## ディレクトリ構造

```
claude-code-playground/
├── README.md      # プロジェクトの説明
├── CLAUDE.md      # このファイル（Claude Code用の情報）
├── src/           # ソースコード
│   ├── hello.py   # Pythonサンプル
│   └── example.js # JavaScriptサンプル
├── tests/         # テストコード
├── docs/          # ドキュメント
├── examples/      # サンプルコード
└── apps/          # アプリケーションディレクトリ
    ├── calculator/    # 計算機アプリ
    └── bun-demo/     # Bunランタイムデモ
```

## 開発環境

- Python 3.x
- Node.js/JavaScript
- Bun (高速JavaScript/TypeScriptランタイム)
- Git管理されたプロジェクト

## 重要な注意事項

- このプロジェクトはClaude Codeの機能テスト用です
- 実験的なコードやサンプルを自由に追加してください

## よく使うコマンド

```bash
# Pythonアプリの実行
python3 -m apps.calculator.calculator_demo

# テストの実行
python3 tests/calculator/test_calculator.py -v

# Bunアプリの実行（bunがインストールされている場合）
~/.bun/bin/bun run apps/bun-demo/server.ts
~/.bun/bin/bun test apps/bun-demo/

# 新しいブランチの作成
git checkout -b feature/アプリ名-機能名
```

## プロジェクトの目的

1. Claude Codeの各種機能（ファイル操作、コード編集、実行など）のテスト
2. AI支援開発の実践
3. 開発ワークフローの確認

## Claude Codeへの設定

### 会話スタイル

- フランクで友人のような口調で話す
- 温かみがあって優しい雰囲気を心がける
- 絵文字を適度に使用する（使いすぎない程度に）
- 堅苦しい敬語は避けて、親しみやすい話し方をする

### 効果的な使い方のコツ

#### 深い思考を促すテクニック

複雑な問題や重要な判断が必要な場合、以下のフレーズを使うと効果的です：

- **「think hard」** - 難しい問題に取り組む前に使用
- **「ultrathink」** - 特に複雑な設計やアーキテクチャの検討時
- **「よくThinkして」** - 日本語での深い思考促進
- **「じっくり考えて」** - 慎重な判断が必要な場合

例：

```
「think hard: このアプリケーションの最適なアーキテクチャを提案して」
「ultrathink: セキュリティを考慮したユーザー認証システムの設計をお願い」
「よくThinkして、このバグの根本原因を特定して」
```

これらのフレーズを使うことで、より深い分析と質の高い提案が期待できます。

## プロジェクトメモリー

### 作成済みアプリケーション

#### 1. 計算機アプリ (apps/calculator/)

- Pythonで実装した科学計算機
- 基本的な四則演算、累乗、平方根、三角関数をサポート
- テストコード付き（tests/calculator/）

#### 2. Bunデモプロジェクト (apps/bun-demo/)

**概要**: Bunランタイムの包括的なデモプロジェクト（2025年6月作成）

**インストール**:

```bash
# Bunのインストール
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

**主な機能**:

1. **HTTPサーバー** (`server.ts`)

   - ポート3000で動作
   - 基本的なルーティング実装

2. **APIサーバー** (`api-server.ts`)

   - SQLite連携のTodo API
   - CRUD操作をサポート

3. **WebSocketチャット** (`websocket-server.ts`)

   - リアルタイムチャットアプリ
   - 自動ユーザー名生成機能

4. **テストフレームワーク** (`utils.test.ts`)

   - 組み込みテストランナー
   - モック、スナップショット対応

5. **Workerスレッド** (`worker-demo.ts`)

   - CPUヘビーなタスクの並列処理
   - 素数計算、フィボナッチ数列

6. **シェルスクリプティング** (`shell-demo.ts`)

   - Bunの`$`テンプレートリテラル
   - システム操作、Git連携

7. **Reactバンドリング** (`build.ts`)
   - 開発/本番ビルド設定
   - コード分割、最適化

**実行方法**:

```bash
cd apps/bun-demo
~/.bun/bin/bun run server      # HTTPサーバー
~/.bun/bin/bun run chat        # WebSocketチャット
~/.bun/bin/bun test            # テスト実行
~/.bun/bin/bun run bench       # ベンチマーク
```

**ブランチ**: `feature/bun-demo`でコミット済み
