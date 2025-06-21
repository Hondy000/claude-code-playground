/* eslint-disable no-console */
// Bunのファイル操作API デモ
import { file, write } from 'bun';
import { unlink } from 'node:fs/promises';

// 作成されたファイルを追跡
const createdFiles: string[] = [];

// CI環境の検出
const isCI = process.env.CI === 'true';

// ファイル操作のデモ
async function fileOperationsDemo() {
  console.log('=== Bunのファイル操作デモ ===\n');

  // 1. ファイルの書き込み
  await write('./demo.txt', 'Hello from Bun!\nThis is a test file.\n');
  createdFiles.push('./demo.txt');
  console.log('✅ ファイルを作成しました: demo.txt');

  // 2. ファイルの読み込み（テキスト）
  const textFile = file('./demo.txt');
  const text = await textFile.text();
  console.log('\n📄 ファイル内容（テキスト）:');
  console.log(text);

  // 3. JSONファイルの作成と読み込み
  const jsonData = {
    name: 'Bun Demo',
    version: '1.0.0',
    features: ['高速', 'TypeScript対応', 'バンドラー内蔵'],
    metadata: {
      created: new Date().toISOString(),
      author: 'Claude Code',
    },
  };

  await write('./data.json', JSON.stringify(jsonData, null, 2));
  createdFiles.push('./data.json');
  console.log('✅ JSONファイルを作成しました: data.json');

  const jsonFile = file('./data.json');
  const loadedJson = await jsonFile.json();
  console.log('\n📊 JSONデータ:');
  console.log(loadedJson);

  // 4. ファイル情報の取得
  const stats = await textFile.stat();
  console.log('\n📈 ファイル統計情報:');
  console.log(`  サイズ: ${stats.size} bytes`);
  console.log(`  最終更新: ${stats.mtime}`);
  console.log(`  ファイルタイプ: ${stats.isFile() ? 'ファイル' : 'ディレクトリ'}`);

  // 5. CSVファイルの作成
  const csvData = `名前,年齢,職業
田中太郎,30,エンジニア
鈴木花子,25,デザイナー
佐藤次郎,35,マネージャー`;

  await write('./users.csv', csvData);
  createdFiles.push('./users.csv');
  console.log('\n✅ CSVファイルを作成しました: users.csv');

  // 6. バイナリファイルの操作
  const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello" in hex
  await write('./binary.dat', buffer);
  createdFiles.push('./binary.dat');

  const binaryFile = file('./binary.dat');
  const arrayBuffer = await binaryFile.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  console.log('\n🔢 バイナリデータ:');
  console.log(`  バイト配列: [${Array.from(uint8Array).join(', ')}]`);
  console.log(`  文字列: ${Buffer.from(arrayBuffer).toString()}`);

  // 7. ストリーミング読み込み
  console.log('\n🌊 ストリーミング読み込み:');
  const stream = file('./demo.txt').stream();
  const reader = stream.getReader();

  let chunk;
  while (!(chunk = await reader.read()).done) {
    const text = new TextDecoder().decode(chunk.value);
    console.log(`  チャンク: "${text.trim()}"`);
  }
}

// 非同期処理のデモ
async function asyncDemo() {
  console.log('\n=== 非同期処理のデモ ===\n');

  // 複数ファイルの並列処理
  const files = ['file1.txt', 'file2.txt', 'file3.txt'];
  const promises = files.map(async (filename) => {
    await write(filename, `Content of ${filename}`);
    createdFiles.push(filename);
    return `${filename} created`;
  });

  const results = await Promise.all(promises);
  results.forEach((result) => console.log(`✅ ${result}`));

  // ファイルの存在確認
  console.log('\n🔍 ファイル存在確認:');
  for (const filename of files) {
    const exists = await file(filename).exists();
    console.log(`  ${filename}: ${exists ? '存在します' : '存在しません'}`);
  }
}

// クリーンアップ関数
async function cleanupFiles() {
  if (isCI) {
    console.log('\n🧹 CI環境で実行中のため、クリーンアップをスキップします');
    return;
  }

  console.log('\n🧹 クリーンアップ中...');

  for (const filepath of createdFiles) {
    try {
      if (await file(filepath).exists()) {
        await unlink(filepath);
        console.log(`  削除: ${filepath}`);
      }
    } catch (error) {
      console.error(`  クリーンアップエラー: ${filepath}`, error);
    }
  }

  console.log('🧹 クリーンアップ完了');
}

// メイン実行
async function main() {
  try {
    await fileOperationsDemo();
    await asyncDemo();

    console.log('\n✨ すべてのデモが完了しました！');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    // 必ずクリーンアップを実行
    await cleanupFiles();
  }
}

// 実行
main();

// このファイルをモジュールとして扱う
export {};
