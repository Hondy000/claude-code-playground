/* eslint-disable no-console */
// Bunのパフォーマンステスト

// パフォーマンス測定用のヘルパー関数
async function measureTime(name: string, fn: () => Promise<void> | void) {
  const start = performance.now();
  await fn();
  const end = performance.now();
  const time = end - start;
  console.log(`${name}: ${time.toFixed(2)}ms`);
  return time;
}

// テスト1: ファイル操作のベンチマーク
async function fileOperationBenchmark() {
  console.log('\n📁 ファイル操作ベンチマーク');
  console.log('================================');

  const iterations = 1000;
  const testData = 'Hello, Bun! '.repeat(100);

  // 書き込みテスト
  await measureTime(`${iterations}回のファイル書き込み`, async () => {
    for (let i = 0; i < iterations; i++) {
      await Bun.write(`./temp_${i}.txt`, testData);
    }
  });

  // 読み込みテスト
  await measureTime(`${iterations}回のファイル読み込み`, async () => {
    for (let i = 0; i < iterations; i++) {
      await Bun.file(`./temp_${i}.txt`).text();
    }
  });

  // クリーンアップ
  for (let i = 0; i < iterations; i++) {
    await Bun.file(`./temp_${i}.txt`).unlink();
  }
}

// テスト2: JSON処理のベンチマーク
async function jsonBenchmark() {
  console.log('\n📊 JSON処理ベンチマーク');
  console.log('================================');

  const data = {
    users: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      tags: [`tag${i}`, `tag${i + 1}`, `tag${i + 2}`],
      metadata: {
        created: new Date().toISOString(),
        score: Math.random() * 100,
      },
    })),
  };

  let jsonString = '';

  // JSON.stringify
  await measureTime('JSON.stringify (1000ユーザー)', () => {
    jsonString = JSON.stringify(data);
  });

  // JSON.parse
  await measureTime('JSON.parse (1000ユーザー)', () => {
    JSON.parse(jsonString);
  });

  console.log(`JSONサイズ: ${(jsonString.length / 1024).toFixed(2)} KB`);
}

// テスト3: 暗号化のベンチマーク
async function cryptoBenchmark() {
  console.log('\n🔐 暗号化ベンチマーク');
  console.log('================================');

  const data = 'This is a secret message! '.repeat(1000);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // SHA-256ハッシュ
  await measureTime('SHA-256 ハッシュ (1000回)', async () => {
    for (let i = 0; i < 1000; i++) {
      await crypto.subtle.digest('SHA-256', dataBuffer);
    }
  });

  // Bun.hash (非暗号学的ハッシュ)
  await measureTime('Bun.hash (1000回)', () => {
    for (let i = 0; i < 1000; i++) {
      Bun.hash(data);
    }
  });
}

// テスト4: 配列操作のベンチマーク
async function arrayBenchmark() {
  console.log('\n🔢 配列操作ベンチマーク');
  console.log('================================');

  const size = 1000000;

  // 配列の作成
  let array: number[] = [];
  await measureTime(`${size}要素の配列作成`, () => {
    array = Array.from({ length: size }, (_, i) => i);
  });

  // map操作
  await measureTime('map操作 (x2)', () => {
    array.map((x) => x * 2);
  });

  // filter操作
  await measureTime('filter操作 (偶数)', () => {
    array.filter((x) => x % 2 === 0);
  });

  // reduce操作
  await measureTime('reduce操作 (合計)', () => {
    array.reduce((sum, x) => sum + x, 0);
  });

  // ソート
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  await measureTime('ソート操作', () => {
    shuffled.sort((a, b) => a - b);
  });
}

// テスト5: HTTPリクエストのベンチマーク
async function httpBenchmark() {
  console.log('\n🌐 HTTPリクエストベンチマーク');
  console.log('================================');

  // ローカルサーバーを起動
  const server = Bun.serve({
    port: 4000,
    fetch() {
      return new Response('OK');
    },
  });

  const requests = 100;

  // 逐次リクエスト
  await measureTime(`${requests}回の逐次リクエスト`, async () => {
    for (let i = 0; i < requests; i++) {
      await fetch(`http://localhost:4000`);
    }
  });

  // 並列リクエスト
  await measureTime(`${requests}回の並列リクエスト`, async () => {
    await Promise.all(Array.from({ length: requests }, () => fetch(`http://localhost:4000`)));
  });

  server.stop();
}

// メモリ使用量の表示
function showMemoryUsage() {
  const usage = process.memoryUsage();
  console.log('\n💾 メモリ使用量:');
  console.log(`  RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  ヒープ合計: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  ヒープ使用: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  外部: ${(usage.external / 1024 / 1024).toFixed(2)} MB`);
}

// メイン実行
async function main() {
  console.log('🚀 Bunパフォーマンステスト開始');
  console.log(`Bunバージョン: ${Bun.version}`);
  console.log(`プラットフォーム: ${process.platform}`);
  console.log(`CPU: ${navigator.hardwareConcurrency} コア`);

  showMemoryUsage();

  await fileOperationBenchmark();
  await jsonBenchmark();
  await cryptoBenchmark();
  await arrayBenchmark();
  await httpBenchmark();

  showMemoryUsage();

  console.log('\n✅ すべてのベンチマークが完了しました！');
}

// 実行
main().catch(console.error);

// このファイルをモジュールとして扱う
export {};
