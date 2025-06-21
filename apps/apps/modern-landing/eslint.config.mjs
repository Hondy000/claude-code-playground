// ============================================================
// ESLint 設定ファイル
// ============================================================
// コード品質を保つためのリンター設定を定義します。
// Next.jsの推奨設定（Core Web Vitals、TypeScript）を使用して、
// パフォーマンスとアクセシビリティを最適化します。
// ============================================================

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// ESモジュールで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESLintの互換性ユーティリティ
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint設定
const eslintConfig = [
  // Next.jsの推奨設定を拡張
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
