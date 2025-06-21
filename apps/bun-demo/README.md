# Bun Demo Application

Bunの各種機能を実演するデモアプリケーション集です。

## 必要な環境

- Bun v1.0以上
- Node.js互換の環境

## インストール

```bash
bun install
```

## 利用可能なデモ

### 1. HTTPサーバー

```bash
bun run server  # http://localhost:3000
```

### 2. APIサーバー（SQLite付き）

```bash
bun run api  # http://localhost:3001/api/todos
```

### 3. WebSocketチャットサーバー

```bash
bun run chat  # http://localhost:3003
```

### 4. Workerスレッドデモ

```bash
bun run worker-demo
```

### 5. ファイル操作デモ

```bash
bun run file-demo
```

### 6. ビルドデモ

```bash
bun run build
```

### 7. React開発サーバー

```bash
bun run react-dev  # Hot Module Replacement付き
```

## 環境変数

以下の環境変数で設定をカスタマイズできます：

- `HTTP_PORT` - HTTPサーバーのポート（デフォルト: 3000）
- `API_PORT` - APIサーバーのポート（デフォルト: 3001）
- `WS_PORT` - WebSocketサーバーのポート（デフォルト: 3003）
- `WORKER_POOL_SIZE` - Workerプールのサイズ（デフォルト: CPUコア数）
- `CORS_ORIGIN` - CORS許可オリジン（デフォルト: \*）
- `WS_RECONNECT_DELAY` - WebSocket再接続遅延（デフォルト: 3000ms）

## テスト実行

```bash
bun test
```

## ベンチマーク

```bash
bun run bench
```

## 注意事項

- このアプリケーションはデモ目的のため、本番環境での使用は推奨されません
- SQLiteはメモリ内データベースを使用しているため、再起動でデータが失われます

## 修正済みの問題

1. Worker APIのブラウザ/Node.js環境の混在を修正
2. メモリリークの可能性があったWorkerプールを改善
3. 非効率なフィボナッチ関数を最適化
4. ハードコーディングされた設定値を環境変数対応に変更
5. エラーハンドリングを強化
