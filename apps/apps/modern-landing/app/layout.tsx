// ============================================================
// ルートレイアウト - Next.js アプリケーション全体の基本構造
// ============================================================
// このファイルは全ページで共通して使用されるHTML構造を定義します。
// フォントの設定、メタデータ、言語設定などの基本的な設定を行います。
// ============================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// サンセリフフォント（Geist）の設定
// UIテキストや本文に使用されるメインフォント
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// モノスペースフォント（Geist Mono）の設定
// コードブロックやプログラミング関連のテキストに使用
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ページのメタデータ設定
// SEOやソーシャルメディアでの表示に影響します
export const metadata: Metadata = {
  title: "VibeCode - 雰囲気でコーディング | AI音声入力開発ツール",
  description: "「なんとなくこんな感じ」から始まる、AIとの対話型開発。音声入力でコーディングの概念を革新する新時代のツール。",
};

// ルートレイアウトコンポーネント
// 全てのページコンポーネントをラップし、共通のHTML構造を提供
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
