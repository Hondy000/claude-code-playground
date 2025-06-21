# GitHub Actions CI/CD パイプライン

このディレクトリには、プロジェクトのCI/CDワークフローが含まれています。

## 🚀 ワークフロー一覧

### 1. Bun CI (`bun-ci.yml`)

**目的**: Bunプロジェクトのテスト、ビルド、ベンチマーク実行

**トリガー**:

- main, develop, feature/\* ブランチへのプッシュ
- mainブランチへのPR

**実行内容**:

- マルチOS対応（Ubuntu, macOS）
- Bunテストの実行
- TypeScript型チェック
- ビルドチェック
- ベンチマーク実行
- ビルド成果物のアップロード

### 2. Code Quality (`quality-check.yml`)

**目的**: コード品質とフォーマットの検証

**トリガー**:

- すべてのプッシュとPR

**実行内容**:

- Prettierフォーマットチェック
- ESLintによる静的解析
- TypeScript型チェック
- Pythonコード品質チェック（Black, Flake8, isort）
- Trivyセキュリティスキャン

### 3. PR Check (`pr-check.yml`)

**目的**: プルリクエストの包括的なチェック

**トリガー**:

- PR作成時、更新時

**実行内容**:

- PR情報の表示
- 変更サイズのチェック（大規模PRの警告）
- すべてのチェックの実行
- 成功時のPRコメント

## 🛠️ ローカルでの実行方法

### 依存関係のインストール

```bash
# プロジェクトルートで
bun install

# apps/bun-demoで
cd apps/bun-demo && bun install
```

### 各種チェックの実行

```bash
# フォーマットチェック
bun run format:check

# ESLint
bun run lint

# TypeScriptチェック
bun run typecheck

# テスト実行
cd apps/bun-demo && bun test

# すべてのチェック
bun run ci
```

### フォーマット修正

```bash
# Prettierでフォーマット
bun run format

# ESLint自動修正
bun run lint:fix
```

## 📝 型エラーの修正について

現在、いくつかのTypeScriptエラーが存在します：

- `react-app/`: DOM関連の型定義が必要
- `build.ts`: Bun.BuildConfigの型定義更新が必要
- `worker.ts`: Worker環境の型定義が必要

これらは今後修正予定です。

## 🔒 セキュリティ

- Trivyによる脆弱性スキャン実施
- SARIFフォーマットでGitHubに報告
- CRITICAL/HIGHレベルの脆弱性を検出

## 🚦 ブランチ保護ルール（推奨）

GitHubリポジトリ設定で以下を有効化することを推奨：

1. mainブランチへの直接プッシュを禁止
2. PRマージ前にすべてのチェックパス必須
3. レビュー承認必須（1人以上）
4. ブランチを最新に保つ

## 📊 CI/CDステータス確認

GitHubのActionsタブで実行状況を確認できます。各ワークフローの実行ログ、エラー詳細も参照可能です。
