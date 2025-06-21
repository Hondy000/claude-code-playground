# Claude Code Playground

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Hondy000/claude-code-playground)
[![Python Tests](https://github.com/Hondy000/claude-code-playground/actions/workflows/python-tests.yml/badge.svg)](https://github.com/Hondy000/claude-code-playground/actions/workflows/python-tests.yml)
[![Node.js CI](https://github.com/Hondy000/claude-code-playground/actions/workflows/nodejs-tests.yml/badge.svg)](https://github.com/Hondy000/claude-code-playground/actions/workflows/nodejs-tests.yml)
[![All Tests](https://github.com/Hondy000/claude-code-playground/actions/workflows/all-tests.yml/badge.svg)](https://github.com/Hondy000/claude-code-playground/actions/workflows/all-tests.yml)

Claude
Codeの機能をテストするための開発環境です。複数のミニアプリケーションを管理するプロジェクト構造になっています。

## ディレクトリ構造

```
claude-code-playground/
├── README.md        # このファイル
├── CLAUDE.md        # Claude Code用の設定と情報
├── apps/            # アプリケーション
│   ├── calculator/  # 電卓アプリ
│   │   ├── __init__.py
│   │   ├── calculator.py      # コアロジック
│   │   ├── calculator_gui.py  # GUI版
│   │   ├── calculator_demo.py # デモプログラム
│   │   └── calculator.html    # Web版
│   └── (今後のアプリ用ディレクトリ)
├── tests/           # テストコード
│   ├── calculator/  # 電卓アプリのテスト
│   │   ├── __init__.py
│   │   ├── test_calculator.py
│   │   └── test_calculator_gui.py
│   └── (今後のアプリテスト用ディレクトリ)
├── examples/        # サンプルコード
│   ├── hello.py
│   └── example.js
├── docs/            # ドキュメント
└── requirements.txt # Python依存関係
```

## 現在のアプリケーション

### 🧮 電卓アプリ (Calculator)

- **コアモジュール**: 四則演算、累乗、メモリ機能
- **GUI版**: tkinterを使用したデスクトップアプリ
- **Web版**: HTML/JavaScriptで実装
- **テスト**: 29個のテストケース完備

#### 使い方

```bash
# デモプログラムを実行
python3 -m apps.calculator.calculator_demo

# Web版を開く
open apps/calculator/calculator.html

# テストを実行
python3 tests/calculator/test_calculator.py -v
```

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/Hondy000/claude-code-playground.git
cd claude-code-playground

# 必要に応じて仮想環境を作成（推奨）
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# アプリケーションの依存関係をインストール（現在は標準ライブラリのみ）
pip install -r requirements.txt

# 開発ツールをインストール（オプション）
pip install -r requirements-dev.txt
```

## 新しいアプリの追加方法

1. `apps/`に新しいディレクトリを作成
2. `__init__.py`とアプリケーションファイルを追加
3. `tests/`に対応するテストディレクトリを作成
4. テストファイルを追加

## 利用可能な機能

- ファイルの読み書き・編集
- プログラムの実行
- Webサイトの取得・解析
- ディレクトリ構造の操作
- その他の開発タスク

## ドキュメント

- [Claude Codeのセッション管理とログ活用ガイド](docs/claude_code_session_issue.md) - セッション復旧とログ分析の方法
