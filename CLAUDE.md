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
└── examples/      # サンプルコード
```

## 開発環境
- Python 3.x
- Node.js/JavaScript
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

## Claude Codeセッション管理
セッションが中断された場合の復旧方法について、詳しいガイドを用意しました：
- [Claude Codeのセッション管理とログ活用ガイド](docs/claude_code_session_management_guide.md)
