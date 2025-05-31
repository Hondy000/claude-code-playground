# Claude Codeのセッション管理とログ活用ガイド

## 概要

Claude Codeのセッションが中断された場合（タブを閉じた、アプリがクラッシュした等）に、過去のやり取りを確認・復旧する方法についての包括的なガイドです。

### クイックリファレンス
- **セッション履歴を見る**: `ESC ESC`（ESCキーを2回連続）
- **最新セッションを継続**: `claude -c`
- **特定セッションを再開**: `claude -r "セッションID"`
- **詳細出力を見る**: `Ctrl+R`

## はじめに

Claude Codeは、すべての会話履歴をローカルに保存しています。これにより、予期しないセッションの中断後でも、作業を継続することが可能です。

## ログファイルの保存場所

### 1. 会話履歴（メイン）
```bash
~/.claude/projects/プロジェクトパス/セッションID.jsonl
```
- **形式**: JSONL（JSON Lines）
- **内容**: ユーザーとClaudeの完全な会話履歴、ツール使用履歴、タイムスタンプ

### 2. CLIログ
```bash
~/.cache/claude-cli-nodejs/プロジェクトパス/mcp-logs-ide/
```
- **形式**: ログファイル
- **内容**: CLIレベルのデバッグ情報、エラーログ

### 3. Cursorログ（Cursor使用時）
```bash
~/.cursor-server/data/logs/*/exthost1/Anthropic.claude-code/Claude Code.log
```
- **形式**: テキストログ
- **内容**: Cursor統合時の拡張機能ログ

## セッションファイルの構造

### JSONL形式の内容
各行が1つのイベントを表すJSON形式：

```json
{"type": "user_message", "content": "ユーザーの入力", "timestamp": "2025-01-06T10:00:00Z"}
{"type": "assistant_message", "content": "Claudeの応答", "timestamp": "2025-01-06T10:00:01Z"}
{"type": "tool_use", "tool": "Bash", "input": {"command": "ls -la"}, "output": "...", "timestamp": "2025-01-06T10:00:02Z"}
```

### 保存される情報
- ユーザーとClaudeの完全な会話履歴
- 使用したツールとその入出力
- タイムスタンプとコスト情報
- 作業ディレクトリとプロジェクト情報
- エラーメッセージとデバッグ情報

## セッション復旧の手順

### 方法1: キーボードショートカットを使用（推奨）
1. **ESC ESC**（ESCキーを2回連続で押す）で履歴を遡る
2. `--resume` コマンドで前のセッションを継続
3. または `claude -c` で最新の会話を継続
4. 特定のセッションを再開: `claude -r "<session-id>"`

### 方法2: コマンドラインから
```bash
# 最新の会話を継続
claude -c

# 特定のセッションを再開
claude -r "セッションID"
```

### 方法3: 手動でセッションファイルを確認
#### 1. 最新のセッションファイルを特定
```bash
# 最新のセッションファイルを見つける
ls -la ~/.claude/projects/$(pwd | sed "s|/|-|g")/
```

#### 2. セッション内容を確認
```bash
# 最新のセッションの最後の10行を表示
tail -n 10 ~/.claude/projects/$(pwd | sed "s|/|-|g")/*.jsonl | jq .
```

#### 3. 特定の内容を検索
```bash
# 特定のコマンドやキーワードを検索
grep "検索キーワード" ~/.claude/projects/$(pwd | sed "s|/|-|g")/*.jsonl
```

## 実用的なスクリプト例

### セッション要約スクリプト
```bash
#!/bin/bash
# session_summary.sh - Claude Codeセッションの要約を表示
set -euo pipefail

# jqコマンドの存在確認
if ! command -v jq &> /dev/null; then
    echo "エラー: jqコマンドがインストールされていません。"
    echo "インストール方法:"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    echo "  macOS: brew install jq"
    echo "  その他: https://stedolan.github.io/jq/download/"
    exit 1
fi

SESSION_DIR="$HOME/.claude/projects/$(pwd | sed "s|/|-|g")"
LATEST_SESSION=$(ls -t "$SESSION_DIR"/*.jsonl 2>/dev/null | head -1)

if [ -z "$LATEST_SESSION" ]; then
    echo "セッションファイルが見つかりません。"
    exit 1
fi

echo "最新のセッション: $(basename "$LATEST_SESSION")"
echo "セッション開始時刻: $(head -1 "$LATEST_SESSION" | jq -r '.timestamp')"
echo "セッション終了時刻: $(tail -1 "$LATEST_SESSION" | jq -r '.timestamp')"
echo ""
echo "会話数: $(grep -c '"type":"user_message"' "$LATEST_SESSION")"
echo "ツール使用回数: $(grep -c '"type":"tool_use"' "$LATEST_SESSION")"
```

### セッション履歴ビューワー
```python
#!/usr/bin/env python3
# view_session.py - Claude Codeセッションを見やすく表示

import json
import sys
from pathlib import Path
from datetime import datetime

def view_session(session_file):
    with open(session_file, 'r') as f:
        for line in f:
            data = json.loads(line)
            timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
            
            if data['type'] == 'user_message':
                print(f"\n[{timestamp}] USER:")
                print(data['content'])
            elif data['type'] == 'assistant_message':
                print(f"\n[{timestamp}] CLAUDE:")
                print(data['content'][:200] + "..." if len(data['content']) > 200 else data['content'])
            elif data['type'] == 'tool_use':
                print(f"\n[{timestamp}] TOOL: {data['tool']}")
                print(f"Input: {json.dumps(data['input'], ensure_ascii=False)[:100]}...")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        view_session(sys.argv[1])
    else:
        print("使用方法: python view_session.py <session_file.jsonl>")
```

## ベストプラクティス

### 1. 定期的なバックアップ
```bash
# セッションファイルの定期バックアップ
cp -r ~/.claude/projects/ ~/claude_backup_$(date +%Y%m%d)
```

### 2. セッション管理のコツ
- 重要な作業の前後でセッションIDをメモしておく
- 長時間の作業では、定期的に進捗をCLAUDE.mdに記録
- `/memory`コマンドを使って重要な情報を保存

### 3. トラブルシューティング
- セッションが見つからない場合は`/doctor`コマンドで診断
- 権限エラーの場合は、ファイルの所有者を確認
- 大きなプロジェクトでは、検索時間がかかることがある

## セキュリティとプライバシー

### 注意事項
1. **機密情報の扱い**
   - セッションファイルには入力したすべての情報が含まれる
   - パスワードや秘密鍵を入力した場合は、該当セッションを削除

2. **アクセス権限**
   ```bash
   # セッションファイルの権限を確認
   ls -la ~/.claude/projects/
   # 必要に応じて権限を制限
   chmod 700 ~/.claude/projects/
   ```

3. **定期的なクリーンアップ**
   ```bash
   # 30日以上前のセッションを削除
   find ~/.claude/projects/ -name "*.jsonl" -mtime +30 -delete
   ```

## 便利なコマンドとショートカット

### キーボードショートカット
- **ESC** - 現在の操作をキャンセル
- **ESC ESC**（2回連続） - 履歴を遡る（過去のセッションにジャンプ）
  - その後 `--resume` を使用して前のセッションを継続可能
- **Ctrl+R** - 詳細出力を表示（Claudeの思考プロセスを確認）
- **Shift+Tab** - 編集の自動承認モード（ファイル編集は自動承認、Bashコマンドは手動承認）
- **Shift+Enter** または **Option+Enter** - 複数行入力（設定が必要な場合は `/terminal-setup`）
- **Tab** - ファイル名やパスの自動補完
- **#**（ハッシュ） - 現在の会話をメモリに追加（CLAUDE.mdに保存）
- **!**（感嘆符） - Bashモード（シェルコマンドを直接実行）
- **@**（アット） - ファイルやフォルダを現在のセッションに追加
- **Cmd+Ctrl+Shift+4**（macOS） - スクリーンショットをクリップボードにコピー → **Ctrl+V**で貼り付け

### Claude Code内で使用可能なスラッシュコマンド

#### 基本コマンド
- `/help` - ヘルプの表示とコマンド一覧
- `/init` - プロジェクトを分析してCLAUDE.mdを自動生成
- `/bug` - 問題の報告
- `/doctor` - システム診断
- `/clear` - ターミナルのクリア
- `/continue` - 最新の会話を読み込む

#### 設定・カスタマイズ
- `/terminal-setup` - ターミナル設定（Shift+Enterなどの設定）
- `/allowed-tools` - Claudeが使用できるツールの権限設定
- `/theme` - カラースキーム設定（light/dark/Daltonize）
- `/config` - 各種設定管理（通知のON/OFFなど）
- `/install-github-app` - GitHub統合（issueやPRで@claudeをタグ可能）

#### ファイル・検索コマンド
- `/diff` - ファイルの差分表示
- `/search` - コードベース内を検索
- `/recent` - 最近のファイルや変更を表示
- `/files` - ファイル管理操作

#### カスタムスラッシュコマンド
- **プロジェクト固有**: `.claude/commands/`フォルダ内のMarkdownファイル
  - 例: `/project:fix-github-issue #123`
- **ユーザー共通**: `~/.claude/commands/`フォルダ内のMarkdownファイル
  - 例: `/user:context_prime`（コードベース探索用）
- 特殊キーワード`$ARGUMENTS`でパラメータを渡すことが可能

#### MCP (Model Context Protocol) 統合
- `claude mcp add` - MCPサーバーを追加
- `claude mcp list` - 設定済みMCPサーバー一覧
- `claude mcp remove` - MCPサーバーを削除

### 外部ツール
- [ccusage](https://github.com/ryoppippi/ccusage) - Claude Code使用状況の分析ツール
- jq - JSONLファイルの解析に便利
- grep/ripgrep - セッション内の検索

## トラブルシューティング

### Q: セッションファイルが見つからない
A: 以下を確認してください：
1. 正しいプロジェクトディレクトリにいるか
2. `~/.claude/`ディレクトリが存在するか
3. ファイルの権限が適切か

### Q: セッションが大きすぎて開けない
A: 部分的に読み込む：
```bash
# 最後の100行だけ表示
tail -n 100 session.jsonl | jq .
```

### Q: 特定の作業を見つけたい
A: grepとjqを組み合わせる：
```bash
grep "検索キーワード" *.jsonl | jq -r '.content' | less
```

## その他の便利な使い方

### コマンドライン引数
```bash
# 最新の会話を継続
claude -c

# 特定のセッションを再開
claude -r "セッションID"

# ヘッドレスモード（プログラム的な統合）
claude -p "タスクの説明" --allowedTools Edit Bash

# ストリーミングJSON出力
claude -p "タスク" --output-format stream-json
```

### ワークフローの例
```bash
# コードについて質問
> 認証システムはどのように動作していますか？

# Gitワークフロー
> 変更をコミットして
> PRを作成して
> mainにリベースしてマージコンフリクトを解決して

# バグ修正
> authモジュールの型エラーを修正して
```

### プロのヒント
1. **TDD（テスト駆動開発）**: ClaudeはTDDを好みます。先にテストとモックを作成し、次にモックを実装に置き換える
2. **音声入力**: 長いプロンプトや複雑な指示を口述する際に便利
   - **macOS**:
     - デフォルト: `Fn Fn`（Fnキーを2回押す）で音声入力を起動
     - 設定変更: システム設定 > キーボード > 音声入力から変更可能
     - その他のオプション: Control 2回押し、Command 2回押し、カスタムショートカット
     - 終了方法: 完了ボタンをクリック、Fnを1回押す、または別のウィンドウに切り替え
   - **Windows 11**:
     - ショートカット: `Win + H`キーで音声入力を起動
     - 使い方: テキスト入力欄にカーソルを置いて`Win + H`を押し、マイクアイコンをクリックして話す
     - 注意: インターネット接続とマイクが必要
3. **カスタムコマンド**: 繰り返し使うワークフローは`.claude/commands/`に保存してスラッシュコマンド化
4. **自動コンパクト**: Claudeは自動的にコンテキストを圧縮するため、無限のコンテキストがあるように感じられる

## まとめ

Claude Codeのセッション管理機能を理解し活用することで、作業の継続性と生産性を大幅に向上させることができます。定期的なバックアップと適切なセキュリティ対策を心がけることで、安全で効率的な開発環境を維持できます。

### 重要なポイント
- **ESC ESC**で即座にセッション履歴にアクセス
- キーボードショートカットとスラッシュコマンドを活用して効率化
- カスタムコマンドで繰り返し作業を自動化
- セッションファイルは自動保存されるため、中断しても安心

## 関連リンク

- [Claude Code公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Codeトラブルシューティング](https://docs.anthropic.com/en/docs/claude-code/troubleshooting)
- [メモリ管理について](https://docs.anthropic.com/en/docs/claude-code/memory)
