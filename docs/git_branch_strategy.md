# Git ブランチ戦略

このプロジェクトでのGitブランチの運用ルールです。

## 🌳 ブランチの種類

### main/master
- **用途**: 安定版のコード
- **マージ条件**:
  - すべてのテストがパス
  - コードレビュー完了（該当する場合）
  - 動作確認済み

### feature/\*
- **用途**: 新機能の開発
- **命名規則**: `feature/アプリ名-機能名`
- **例**:
  - `feature/calculator-scientific-mode`
  - `feature/todo-app-initial`
  - `feature/timer-notification`

### fix/\*
- **用途**: バグ修正
- **命名規則**: `fix/アプリ名-修正内容`
- **例**:
  - `fix/calculator-division-error`
  - `fix/todo-save-bug`

### refactor/\*
- **用途**: リファクタリング
- **命名規則**: `refactor/対象-内容`
- **例**:
  - `refactor/project-structure`
  - `refactor/calculator-tests`

### docs/\*
- **用途**: ドキュメントの更新
- **命名規則**: `docs/ドキュメント名`
- **例**:
  - `docs/readme-update`
  - `docs/claude-capabilities`

### experiment/\*
- **用途**: 実験的な機能やアイデアの検証
- **命名規則**: `experiment/実験内容`
- **例**:
  - `experiment/ai-integration`
  - `experiment/new-ui-framework`
- **注意**: mainにマージしない前提

## 📋 ブランチ運用フロー

### 1. 新機能開発
```bash
# mainから新しいブランチを作成
git checkout main
git pull origin main
git checkout -b feature/app-name-feature-name

# 開発作業...

# コミット
git add .
git commit -m "feat: 機能の説明"

# プッシュ
git push -u origin feature/app-name-feature-name
```

### 2. バグ修正
```bash
# mainから修正ブランチを作成
git checkout main
git checkout -b fix/app-name-bug-description

# 修正作業...

# コミット
git add .
git commit -m "fix: バグの説明"
```

### 3. マージ
```bash
# mainを最新に更新
git checkout main
git pull origin main

# ブランチをマージ
git merge feature/app-name-feature-name

# またはGitHubでPRを作成してマージ
```

## 🏷️ コミットメッセージ規約

### プレフィックス
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `refactor:` リファクタリング
- `test:` テストの追加・修正
- `chore:` その他の変更（ビルド、CI等）

### 例
```
feat: 電卓に平方根計算機能を追加
fix: ゼロ除算時のエラーハンドリングを修正
docs: READMEにインストール手順を追加
refactor: calculator.pyのコード構造を改善
test: 電卓の境界値テストを追加
```

## 🔄 プルリクエスト（PR）のルール

### PRを作成する場合
1. **タイトル**: ブランチ名と同じ規則
2. **説明**:
   - 変更内容の概要
   - テスト方法
   - 関連するIssue（あれば）
3. **チェックリスト**:
   - [ ] テストをパス
   - [ ] ドキュメントを更新（必要な場合）
   - [ ] コードスタイルに準拠

## 🚀 ブランチのライフサイクル

1. **作成**: 作業開始時
2. **開発**: 機能実装・修正
3. **テスト**: 動作確認
4. **マージ**: mainへ統合
5. **削除**: マージ後は削除（履歴はGitに残る）

```bash
# マージ後のブランチ削除
git branch -d feature/app-name-feature-name
git push origin --delete feature/app-name-feature-name
```

## 💡 ベストプラクティス

1. **小さく頻繁に**: 大きな変更は小さなブランチに分割
2. **明確な名前**: ブランチ名から内容が分かるように
3. **早めのプッシュ**: ローカルに留めず、リモートにプッシュ
4. **定期的な同期**: mainの変更を定期的に取り込む
5. **クリーンな履歴**: 意味のあるコミットメッセージ

## 🛠️ 便利なエイリアス設定

```bash
# ~/.gitconfigに追加
[alias]
    # 新しいfeatureブランチを作成
    new-feature = "!f() { git checkout main && git pull && git checkout -b feature/$1; }; f"

    # 新しいfixブランチを作成
    new-fix = "!f() { git checkout main && git pull && git checkout -b fix/$1; }; f"

    # ブランチの一覧を見やすく表示
    br = branch --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) %(color:green)(%(committerdate:relative))%(color:reset)'
```

使用例:
```bash
git new-feature calculator-history
git new-fix todo-app-save-error
git br
```
