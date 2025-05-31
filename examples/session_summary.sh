#!/bin/bash
# session_summary.sh - Claude Codeセッションの要約を表示

SESSION_DIR="$HOME/.claude/projects/$(pwd | sed "s|/|-|g")"
LATEST_SESSION=$(ls -t "$SESSION_DIR"/*.jsonl 2>/dev/null | head -1)

if [ -z "$LATEST_SESSION" ]; then
    echo "セッションファイルが見つかりません。"
    exit 1
fi

echo "最新のセッション: $(basename "$LATEST_SESSION")"

# jqがない場合は基本的な情報のみ表示
if command -v jq >/dev/null 2>&1; then
    echo "セッション開始時刻: $(head -1 "$LATEST_SESSION" | jq -r '.timestamp')"
    echo "セッション終了時刻: $(tail -1 "$LATEST_SESSION" | jq -r '.timestamp')"
else
    echo "セッション開始時刻: $(head -1 "$LATEST_SESSION" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)"
    echo "セッション終了時刻: $(tail -1 "$LATEST_SESSION" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)"
fi

echo ""
echo "会話数: $(grep -c '"type":"user"' "$LATEST_SESSION")"
echo "アシスタント応答数: $(grep -c '"type":"assistant"' "$LATEST_SESSION")"
echo "ツール使用回数: $(grep -c '"type":"tool_use"' "$LATEST_SESSION")"
echo ""
echo "ファイルサイズ: $(ls -lh "$LATEST_SESSION" | awk '{print $5}')"
echo "総行数: $(wc -l < "$LATEST_SESSION")"