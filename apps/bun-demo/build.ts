/* eslint-disable no-console */
// Bunのビルド設定とバンドリングデモ

console.log('🚀 Bun バンドリングデモ');
console.log('================================\n');

// ビルド設定
const buildConfigs: Array<{ name: string; config: any }> = [
  // 1. 開発ビルド
  {
    name: '開発ビルド',
    config: {
      entrypoints: ['./react-app/index.tsx'],
      outdir: './dist/dev',
      target: 'browser' as const,
      sourcemap: 'external' as const,
      minify: false,
      splitting: true,
      define: {
        'process.env.NODE_ENV': '"development"',
        'process.env.BUN_VERSION': `"${Bun.version}"`,
      },
    },
  },

  // 2. 本番ビルド
  {
    name: '本番ビルド（最適化）',
    config: {
      entrypoints: ['./react-app/index.tsx'],
      outdir: './dist/prod',
      target: 'browser' as const,
      sourcemap: false,
      minify: {
        whitespace: true,
        identifiers: true,
        syntax: true,
      },
      splitting: true,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.BUN_VERSION': `"${Bun.version}"`,
      },
    },
  },

  // 3. エッジワーカー向けビルド
  {
    name: 'エッジワーカービルド',
    config: {
      entrypoints: ['./server.ts'],
      outdir: './dist/edge',
      target: 'bun' as const,
      format: 'esm',
      minify: true,
      external: ['bun:sqlite'],
    },
  },
];

// ビルド実行
async function runBuilds() {
  for (const { name, config } of buildConfigs) {
    console.log(`📦 ${name} を開始...`);
    console.time(name);

    try {
      const result = await Bun.build(config);

      if (result.success) {
        console.log(`✅ ${name} 成功`);

        // ビルド統計
        console.log(`  出力ファイル数: ${result.outputs.length}`);

        let totalSize = 0;
        for (const output of result.outputs) {
          const size = output.size || 0;
          totalSize += size;
          console.log(`  - ${output.path}: ${(size / 1024).toFixed(2)} KB`);
        }

        console.log(`  合計サイズ: ${(totalSize / 1024).toFixed(2)} KB`);
      } else {
        console.error(`❌ ${name} 失敗`);
        console.error(result.logs);
      }
    } catch (error) {
      console.error(`❌ ${name} エラー:`, error);
    }

    console.timeEnd(name);
    console.log();
  }
}

// 高度なビルド設定の例
async function advancedBuild() {
  console.log('🔧 高度なビルド機能のデモ');
  console.log('================================\n');

  // コード分割とダイナミックインポート
  const codeSplittingBuild = await Bun.build({
    entrypoints: ['./react-app/index.tsx'],
    outdir: './dist/split',
    target: 'browser' as const,
    splitting: true,
    publicPath: '/assets/',
    // chunkオプションは現在のBun APIでは未サポート
    // naming: '[name]-[hash].[ext]',
  });

  if (codeSplittingBuild.success) {
    console.log('✅ コード分割ビルド成功');
    console.log(`  チャンク数: ${codeSplittingBuild.outputs.length}`);
  }

  // 複数エントリーポイント
  const multiEntryBuild = await Bun.build({
    entrypoints: ['./react-app/index.tsx', './worker.ts', './server.ts'],
    outdir: './dist/multi',
    target: 'browser' as const,
    splitting: true,
  });

  if (multiEntryBuild.success) {
    console.log('\n✅ マルチエントリービルド成功');
    multiEntryBuild.outputs.forEach((output) => {
      console.log(`  - ${output.path}`);
    });
  }
}

// パフォーマンス比較
async function performanceComparison() {
  console.log('\n⚡ パフォーマンス比較');
  console.log('================================');

  // テスト用の大きなファイルを作成
  const testFile = './test-large.js';
  const largeContent = `
    // 大きなファイルのシミュレーション
    ${Array(1000)
      .fill(0)
      .map(
        (_, i) => `
      export function function${i}() {
        return "Function ${i} result: " + Math.random();
      }
    `,
      )
      .join('\n')}
  `;

  await Bun.write(testFile, largeContent);

  // Bunビルド時間測定
  console.time('Bunビルド');
  await Bun.build({
    entrypoints: [testFile],
    outdir: './dist/perf',
    minify: true,
  });
  console.timeEnd('Bunビルド');

  // クリーンアップ
  await Bun.file(testFile).unlink();

  console.log('\n💡 Bunは従来のバンドラーより大幅に高速です！');
}

// HTMLファイルの生成
async function generateHTML() {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bun + React Todo App (Bundled)</title>
  <link rel="stylesheet" href="./index.css">
</head>
<body>
  <div id="root"></div>
  <script src="./index.js"></script>
</body>
</html>`;

  await Bun.write('./dist/prod/index.html', htmlTemplate);
  console.log('✅ HTMLファイルを生成しました');
}

// メイン実行
async function main() {
  await runBuilds();
  await advancedBuild();
  await performanceComparison();
  await generateHTML();

  console.log('\n✨ すべてのビルドが完了しました！');
  console.log('\n📁 ビルド結果は ./dist ディレクトリに出力されています');
  console.log('🌐 本番ビルドを確認するには:');
  console.log('   bun serve ./dist/prod');
}

// 実行
main().catch(console.error);

// このファイルをモジュールとして扱う
export {};
