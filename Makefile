# 開発タスク用Makefile

# Python実行ファイルのパス
PYTHON := ./venv/bin/python
PIP := ./venv/bin/pip
BLACK := ./venv/bin/black
FLAKE8 := ./venv/bin/flake8
ISORT := ./venv/bin/isort
BANDIT := ./venv/bin/bandit

# デフォルトタスク
.PHONY: help
help:
	@echo "利用可能なコマンド:"
	@echo "  make setup      - 開発環境をセットアップ"
	@echo "  make format     - コードをフォーマット"
	@echo "  make lint       - コードをチェック"
	@echo "  make test       - テストを実行"
	@echo "  make check      - format + lint + test"
	@echo "  make clean      - キャッシュをクリーンアップ"

# 開発環境セットアップ
.PHONY: setup
setup:
	@echo "🔧 開発環境をセットアップ..."
	$(PYTHON) -m pip install --upgrade pip
	$(PIP) install -r requirements-dev.txt
	@echo "✅ セットアップ完了!"

# コードフォーマット
.PHONY: format
format:
	@echo "🎨 コードをフォーマット..."
	$(BLACK) .
	$(ISORT) .

# コードチェック
.PHONY: lint
lint:
	@echo "🔍 コードをチェック..."
	$(FLAKE8) apps/ tests/
	$(BANDIT) -r apps/

# テスト実行
.PHONY: test
test:
	@echo "🧪 テストを実行..."
	$(PYTHON) -m unittest discover -s tests -v

# すべてのチェックを実行
.PHONY: check
check: format lint test
	@echo "✅ すべてのチェックが完了!"

# キャッシュクリーンアップ
.PHONY: clean
clean:
	@echo "🧹 キャッシュをクリーンアップ..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	@echo "✨ クリーンアップ完了!"