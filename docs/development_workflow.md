# 開発ワークフロー

このドキュメントでは、コードをpush/PR作成する前に実施すべきローカルでのチェック手順を説明します。

## 🚀 クイックスタート

```bash
# 仮想環境を有効化
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 開発ツールをインストール（初回のみ）
pip install -r requirements-dev.txt

# すべてのチェックを実行
make check  # または ./scripts/check-all.sh
```

## 📋 プルリクエスト前のチェックリスト

### 1. コードフォーマット
```bash
# フォーマットをチェック
black --check apps/ tests/

# 自動フォーマット（必要な場合）
black apps/ tests/
```

### 2. インポートの整理
```bash
# インポート順序をチェック
isort --check-only apps/ tests/

# 自動整理（必要な場合）
isort apps/ tests/
```

### 3. Lintチェック
```bash
# 基本的な文法エラーをチェック
flake8 apps/ tests/

# より詳細なチェック
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
```

### 4. セキュリティチェック
```bash
# セキュリティ脆弱性をスキャン
bandit -r apps/
```

### 5. テストの実行
```bash
# すべてのテストを実行
python -m unittest discover -s tests -p "test_*.py" -v

# 特定のテストモジュールを実行
python -m unittest tests.calculator.test_calculator -v
```

### 6. ドキュメントのチェック（オプション）
```bash
# markdownlintがインストールされている場合
markdownlint README.md CLAUDE.md docs/*.md
```

## 🔄 Git操作の流れ

### 1. 新機能の開発
```bash
# mainブランチを最新に
git checkout main
git pull

# 新しいブランチを作成
git checkout -b feature/機能名
# または
git checkout -b fix/バグ修正名
```

### 2. コミット前の確認
```bash
# 変更内容を確認
git status
git diff

# ステージング
git add -p  # 対話的に追加（推奨）
# または
git add ファイル名

# コミット
git commit -m "type: 簡潔な説明"
```

### 3. Push前の最終チェック
```bash
# 1. すべてのチェックを実行（上記参照）

# 2. コミット履歴を確認
git log --oneline -5

# 3. 必要に応じてコミットを整理
git rebase -i HEAD~3  # 最後の3コミットを整理
```

### 4. Push とPR作成
```bash
# リモートにpush
git push -u origin ブランチ名

# GitHubでPRを作成
# タイトル: type: 簡潔な説明
# 本文: テンプレートに従って記載
```

## 🛠️ 便利なスクリプト

### すべてのチェックを一括実行
`scripts/check-all.sh` を作成：

```bash
#!/bin/bash
set -e

echo "🔍 Running all checks..."

echo "1. Black (format check)..."
black --check apps/ tests/

echo "2. isort (import sort check)..."
isort --check-only apps/ tests/

echo "3. Flake8 (lint)..."
flake8 apps/ tests/

echo "4. Bandit (security)..."
bandit -r apps/ -ll

echo "5. Tests..."
python -m unittest discover -s tests -p "test_*.py"

echo "✅ All checks passed!"
```

### 自動修正スクリプト
`scripts/fix-all.sh` を作成：

```bash
#!/bin/bash

echo "🔧 Auto-fixing code..."

echo "1. Black formatting..."
black apps/ tests/

echo "2. isort..."
isort apps/ tests/

echo "✅ Auto-fix complete! Please review changes."
```

## 💡 Tips

1. **pre-commitフックの活用**（将来的に）
   ```bash
   pip install pre-commit
   pre-commit install
   ```

2. **VSCode/Cursor設定**
   - Black、Flake8、isortの拡張機能をインストール
   - 保存時の自動フォーマットを有効化

3. **エイリアスの設定**
   ```bash
   # ~/.bashrc または ~/.zshrc に追加
   alias check-code="black --check apps/ tests/ && isort --check-only apps/ tests/ && flake8 apps/ tests/"
   alias fix-code="black apps/ tests/ && isort apps/ tests/"
   ```

## 🚨 トラブルシューティング

### pipが見つからない
```bash
# 仮想環境が有効化されているか確認
which python  # venv/bin/python が表示されるべき
```

### インポートエラー
```bash
# PYTHONPATHを設定
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

### Blackとisortの競合
```bash
# .isort.cfg で Black互換モードを設定
[settings]
profile = black
```

## 📚 参考リンク

- [Black ドキュメント](https://black.readthedocs.io/)
- [Flake8 ドキュメント](https://flake8.pycqa.org/)
- [isort ドキュメント](https://pycqa.github.io/isort/)
- [Bandit ドキュメント](https://bandit.readthedocs.io/)