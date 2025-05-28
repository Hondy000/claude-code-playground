#!/bin/bash
# 開発環境セットアップスクリプト

echo "🔧 開発環境をセットアップします..."

# 仮想環境のPythonを使ってpipを更新
echo "📦 pipを更新..."
./venv/bin/python -m pip install --upgrade pip

# 開発ツールをインストール
echo "🛠️ 開発ツールをインストール..."
./venv/bin/pip install -r requirements-dev.txt

# エイリアスを設定
echo ""
echo "✅ セットアップ完了！"
echo ""
echo "以下のコマンドで開発ツールを使えます："
echo "  ./venv/bin/black ."
echo "  ./venv/bin/flake8 ."
echo "  ./venv/bin/isort ."
echo "  ./venv/bin/bandit -r apps/"
echo ""
echo "または、以下をシェルに追加してください："
echo "  alias vpy='./venv/bin/python'"
echo "  alias vpip='./venv/bin/pip'"
echo "  alias vblack='./venv/bin/black'"
echo "  alias vflake8='./venv/bin/flake8'"