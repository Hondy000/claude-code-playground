# Claude Codeのターミナルスクロール問題の解決方法

## 現在の設定オプション

Claude Codeの設定を確認したところ、ターミナルのスクロールを直接制御する設定はありませんでした。

利用可能な設定：
- `verbose`: 詳細出力モード
- `theme`: UIテーマ（dark/light）
- `editorMode`: エディタモード
- `autoCompactEnabled`: 自動圧縮機能

## 解決策

### 1. 出力をページャーで制御する
```bash
# lessを使用して出力を制御
your_command | less

# 行数を指定して表示
your_command | head -50

# tailでリアルタイム監視
your_command | tail -f
```

### 2. 出力をファイルにリダイレクト
```bash
# ファイルに保存して後で確認
your_command > output.log 2>&1

# 画面とファイルの両方に出力
your_command | tee output.log
```

### 3. Claude Codeの--printオプションを活用
```bash
# 非対話的モードで実行（スクロールの問題を回避）
claude --print "your prompt here"

# JSON形式で出力
claude --print --output-format json "your prompt"
```

### 4. バッファサイズの調整（VS Code統合時）
VS Codeのターミナル設定で以下を調整：
- `terminal.integrated.scrollback`: スクロールバックの行数
- `terminal.integrated.smoothScrolling`: スムーズスクロール

### 5. 実行時の工夫
```bash
# 出力を分割して確認
for i in {1..10}; do
    your_command --part $i
    read -p "Press Enter to continue..."
done
```

## 推奨される方法

1. **短い出力の場合**: そのまま実行
2. **長い出力が予想される場合**: `| less`を使用
3. **ログ解析など**: ファイルにリダイレクトして後で確認
4. **Claude Codeでの作業**: `--print`オプションで必要な部分だけ出力

## 注意事項

- Claude Codeはブラウザベースのターミナルエミュレータを使用
- 標準的なターミナル制御コマンド（stty等）は使用不可
- 出力制御は主にパイプやリダイレクトで対応する必要がある