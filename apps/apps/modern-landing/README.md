# 🎤 VibeCode - Vibe Coding ランディングページ

「雰囲気でコーディング」を実現する、AI時代の新しい開発手法を紹介するモダンなランディングページです。

![VibeCode](https://img.shields.io/badge/VibeCode-Vibe%20Coding-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 クイックスタート

### 方法1: 自動起動スクリプト（推奨）

#### Mac/Linux の場合:
```bash
git clone https://github.com/Hondy000/claude-code-playground.git
cd claude-code-playground/apps/apps/modern-landing
./start.sh
```

#### Windows の場合:
```cmd
git clone https://github.com/Hondy000/claude-code-playground.git
cd claude-code-playground\apps\apps\modern-landing
start.bat
```

### 方法2: 手動セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/Hondy000/claude-code-playground.git
cd claude-code-playground/apps/apps/modern-landing

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🎨 特徴

- **Vibe Coding**: Andrej Karpathy提唱の「雰囲気でコーディング」を体験
- **音声入力対応**: 自然言語でAIと対話しながら開発
- **モダンなデザイン**: Framer Motionによるスムーズなアニメーション
- **レスポンシブ対応**: モバイルからデスクトップまで最適化
- **ダークモード**: システム設定に応じて自動切り替え

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React, React Icons

## 📁 プロジェクト構造

```
modern-landing/
├── app/
│   ├── page.tsx          # メインページコンポーネント
│   ├── layout.tsx        # レイアウト設定
│   └── globals.css       # グローバルスタイル
├── public/               # 静的ファイル
├── package.json          # プロジェクト設定
├── start.sh             # Mac/Linux起動スクリプト
├── start.bat            # Windows起動スクリプト
└── README.md            # このファイル
```

## 🎯 使用例

1. **プロジェクトを起動**
   - 起動スクリプトを実行するだけ！

2. **カスタマイズ**
   - `app/page.tsx` を編集してコンテンツを変更
   - `app/globals.css` でカラーテーマをカスタマイズ

3. **デプロイ**
   ```bash
   npm run build
   npm start
   ```

## 🤝 コントリビューション

プルリクエストを歓迎します！Vibe Codingの精神で、「なんとなくこんな感じ」のアイデアも大歓迎です。

## 📄 ライセンス

MIT License

---

**Vibe Codingで、もっと自由に、もっとクリエイティブに。** 🚀✨
