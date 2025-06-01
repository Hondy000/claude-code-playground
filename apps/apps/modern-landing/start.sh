#!/bin/bash

# バイブコーディング ランディングページ 起動スクリプト
# VibeCode Landing Page Startup Script

echo "🎤 VibeCode - バイブコーディング ランディングページを起動します..."
echo ""

# Node.jsがインストールされているか確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません。"
    echo "👉 https://nodejs.org/ からNode.jsをインストールしてください。"
    exit 1
fi

# npmがインストールされているか確認
if ! command -v npm &> /dev/null; then
    echo "❌ npmがインストールされていません。"
    exit 1
fi

echo "📦 Node.js $(node -v) / npm $(npm -v) を検出しました"
echo ""

# 依存関係のインストール
if [ ! -d "node_modules" ]; then
    echo "📥 依存関係をインストールしています..."
    npm install
    echo ""
else
    echo "✅ 依存関係は既にインストールされています"
    echo ""
fi

# ポート3000が使用中かチェック
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート3000が既に使用されています"
    echo "👉 別のポートで起動します (ポート3001)"
    PORT=3001 npm run dev
else
    echo "🚀 開発サーバーを起動しています..."
    echo ""
    echo "📱 ブラウザで以下のURLにアクセスしてください："
    echo "   http://localhost:3000"
    echo ""
    echo "🛑 サーバーを停止するには Ctrl+C を押してください"
    echo ""
    npm run dev
fi