# Bun Demo プロジェクト 🚀

Bunの主要機能を体験できるデモプロジェクトです。

## Bunとは？

Bunは、JavaScriptとTypeScriptのための高速なオールインワンツールキットです。
- ⚡ 超高速な実行速度
- 📦 パッケージマネージャー内蔵
- 🔧 バンドラー・トランスパイラー内蔵
- 🎯 TypeScript対応（設定不要）

## セットアップ

```bash
# Bunのインストール（未インストールの場合）
curl -fsSL https://bun.sh/install | bash

# 依存関係のインストール
bun install
```

## デモの実行方法

### 1. 基本的なHTTPサーバー
```bash
bun run server.ts
# http://localhost:3000 でアクセス
```

エンドポイント:
- `/` - Welcome メッセージ
- `/json` - JSON レスポンス
- `/hello?name=名前` - パーソナライズされた挨拶

### 2. SQLite連携APIサーバー
```bash
bun run api-server.ts
# http://localhost:3001/api/todos でアクセス
```

エンドポイント:
- `GET /api/todos` - Todo一覧取得
- `POST /api/todos` - Todo作成
- `PUT /api/todos/:id` - Todo更新
- `DELETE /api/todos/:id` - Todo削除
- `GET /api/info` - システム情報

### 3. TypeScript型安全APIサーバー
```bash
bun run types-demo.ts
# http://localhost:3002/api/users でアクセス
```

エンドポイント:
- `GET /api/users` - ユーザー一覧
- `GET /api/users/:id` - ユーザー詳細
- `POST /api/users` - ユーザー作成

### 4. ファイル操作デモ
```bash
bun run file-demo.ts
```

デモ内容:
- テキスト・JSON・CSV・バイナリファイルの読み書き
- ストリーミング処理
- 非同期ファイル操作

### 5. パフォーマンステスト
```bash
bun run benchmark.ts
```

テスト項目:
- ファイル操作のベンチマーク
- JSON処理の速度測定
- 暗号化処理の比較
- 配列操作のパフォーマンス
- HTTPリクエストの並列処理

## プロジェクト構造

```
bun-demo/
├── server.ts         # 基本的なHTTPサーバー
├── api-server.ts     # SQLite連携APIサーバー
├── types-demo.ts     # TypeScript型安全デモ
├── file-demo.ts      # ファイル操作デモ
├── benchmark.ts      # パフォーマンステスト
├── package.json      # プロジェクト設定
├── tsconfig.json     # TypeScript設定
└── README.md         # このファイル
```

## Bunの特徴的な機能

### 1. 高速な起動時間
Node.jsと比較して起動時間が大幅に短縮されています。

### 2. ネイティブTypeScriptサポート
```typescript
// 設定不要でTypeScriptが動作
const greeting: string = "Hello, Bun!";
console.log(greeting);
```

### 3. 組み込みSQLiteサポート
```typescript
import { Database } from "bun:sqlite";
const db = new Database(":memory:");
```

### 4. 高速なファイルAPI
```typescript
// シンプルなファイル操作
await Bun.write("file.txt", "Hello!");
const text = await Bun.file("file.txt").text();
```

### 5. Web標準API
```typescript
// Fetch APIやWeb Streamsなどが標準で利用可能
const response = await fetch("https://api.example.com");
```

## 参考リンク

- [Bun公式サイト](https://bun.sh)
- [Bunドキュメント](https://bun.sh/docs)
- [GitHub](https://github.com/oven-sh/bun)

---

This project was created using `bun init` in bun v1.2.16.
