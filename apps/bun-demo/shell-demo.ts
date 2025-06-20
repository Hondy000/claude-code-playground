#!/usr/bin/env bun
// Bunを使ったシェルスクリプティング

import { $ } from "bun";
import { existsSync } from "fs";

// カラー出力用のヘルパー
const colors = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
};

// プログレスバー表示
function showProgress(current: number, total: number, label: string = "") {
  const width = 30;
  const percentage = current / total;
  const filled = Math.floor(width * percentage);
  const empty = width - filled;
  
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const percentText = `${(percentage * 100).toFixed(1)}%`;
  
  process.stdout.write(`\r${label} [${bar}] ${percentText}`);
  
  if (current === total) {
    console.log(); // 改行
  }
}

async function main() {
  console.log(colors.bold(colors.cyan("\n🚀 Bun シェルスクリプティングデモ\n")));
  
  // 1. システム情報の取得
  console.log(colors.yellow("📊 システム情報"));
  console.log("================================");
  
  // OSの情報
  const os = await $`uname -a`.text();
  console.log(`OS: ${os.trim()}`);
  
  // メモリ情報
  if (process.platform === "linux") {
    const memInfo = await $`free -h | grep Mem`.text();
    console.log(`メモリ: ${memInfo.trim()}`);
  }
  
  // ディスク使用量
  const diskUsage = await $`df -h . | tail -1`.text();
  console.log(`ディスク: ${diskUsage.trim()}`);
  
  // 2. ファイル操作デモ
  console.log(colors.yellow("\n📁 ファイル操作デモ"));
  console.log("================================");
  
  // 一時ディレクトリ作成
  const tempDir = "./temp-shell-demo";
  await $`mkdir -p ${tempDir}`;
  console.log(colors.green(`✅ ディレクトリ作成: ${tempDir}`));
  
  // 複数ファイル作成
  const files = ["file1.txt", "file2.txt", "file3.txt"];
  for (let i = 0; i < files.length; i++) {
    await $`echo "Content of ${files[i]}" > ${tempDir}/${files[i]}`;
    showProgress(i + 1, files.length, "ファイル作成中");
  }
  
  // ファイル一覧
  console.log("\n作成したファイル:");
  const fileList = await $`ls -la ${tempDir}`.text();
  console.log(fileList);
  
  // 3. テキスト処理デモ
  console.log(colors.yellow("\n📝 テキスト処理デモ"));
  console.log("================================");
  
  // ログファイル作成
  const logFile = `${tempDir}/app.log`;
  await $`cat > ${logFile} << 'EOF'
2024-01-15 10:00:00 INFO Server started
2024-01-15 10:00:05 DEBUG Database connected
2024-01-15 10:00:10 INFO User login: user1
2024-01-15 10:00:15 ERROR Failed to process request
2024-01-15 10:00:20 WARN Memory usage high
2024-01-15 10:00:25 INFO User logout: user1
2024-01-15 10:00:30 ERROR Database connection lost
2024-01-15 10:00:35 INFO Attempting reconnection
2024-01-15 10:00:40 INFO Database reconnected
2024-01-15 10:00:45 DEBUG Cache cleared
EOF`;
  
  // ログレベルごとの集計
  console.log("ログレベル別集計:");
  const infoCount = await $`grep INFO ${logFile} | wc -l`.text();
  const errorCount = await $`grep ERROR ${logFile} | wc -l`.text();
  const warnCount = await $`grep WARN ${logFile} | wc -l`.text();
  const debugCount = await $`grep DEBUG ${logFile} | wc -l`.text();
  
  console.log(`  ${colors.blue("INFO")}: ${infoCount.trim()}件`);
  console.log(`  ${colors.red("ERROR")}: ${errorCount.trim()}件`);
  console.log(`  ${colors.yellow("WARN")}: ${warnCount.trim()}件`);
  console.log(`  ${colors.magenta("DEBUG")}: ${debugCount.trim()}件`);
  
  // 4. プロセス管理デモ
  console.log(colors.yellow("\n⚙️ プロセス管理デモ"));
  console.log("================================");
  
  // バックグラウンドプロセス開始
  console.log("バックグラウンドプロセスを開始...");
  const bgProcess = $`sleep 5 && echo "バックグラウンドタスク完了"`;
  
  // 別の処理を実行
  for (let i = 1; i <= 3; i++) {
    await Bun.sleep(1000);
    console.log(`  メインプロセス: ${i}秒経過`);
  }
  
  // バックグラウンドプロセスの完了を待つ
  console.log("バックグラウンドプロセスの完了を待機中...");
  const result = await bgProcess.text();
  console.log(colors.green(`✅ ${result.trim()}`));
  
  // 5. Git操作デモ
  console.log(colors.yellow("\n🔧 Git操作デモ"));
  console.log("================================");
  
  // 現在のブランチ
  const branch = await $`git branch --show-current`.text();
  console.log(`現在のブランチ: ${colors.cyan(branch.trim())}`);
  
  // 最新のコミット
  const lastCommit = await $`git log -1 --pretty=format:"%h - %s (%an)"`.text();
  console.log(`最新コミット: ${lastCommit}`);
  
  // 変更ファイル数
  const changedFiles = await $`git status --porcelain | wc -l`.text();
  console.log(`変更ファイル数: ${changedFiles.trim()}`);
  
  // 6. ネットワーク操作デモ
  console.log(colors.yellow("\n🌐 ネットワーク操作デモ"));
  console.log("================================");
  
  // DNSルックアップ
  try {
    const dnsResult = await $`nslookup example.com | grep -A1 "Non-authoritative" | tail -1`.text();
    console.log(`example.com のIP: ${dnsResult.trim()}`);
  } catch {
    console.log("DNSルックアップはこの環境では利用できません");
  }
  
  // HTTPリクエスト（curlの代わりにBunのfetch）
  console.log("\nHTTPリクエスト:");
  const response = await fetch("https://api.github.com/zen");
  const zen = await response.text();
  console.log(`GitHub Zen: "${colors.italic(zen.trim())}"`);
  
  // 7. パイプラインとリダイレクト
  console.log(colors.yellow("\n🔀 パイプラインデモ"));
  console.log("================================");
  
  // 複雑なパイプライン
  const pipeline = await $`
    echo -e "apple\nbanana\ncherry\napple\ndate\nbanana\napple" |
    sort |
    uniq -c |
    sort -rn
  `.text();
  
  console.log("フルーツの出現回数:");
  console.log(pipeline);
  
  // 8. エラーハンドリング
  console.log(colors.yellow("\n❌ エラーハンドリングデモ"));
  console.log("================================");
  
  try {
    await $`false`; // 必ず失敗するコマンド
  } catch (error) {
    console.log(colors.red("✗ コマンドが失敗しました（想定通り）"));
  }
  
  // 条件付き実行
  const fileToCheck = "./nonexistent.txt";
  if (existsSync(fileToCheck)) {
    console.log(`${fileToCheck} が存在します`);
  } else {
    console.log(colors.yellow(`⚠️ ${fileToCheck} が存在しません`));
  }
  
  // クリーンアップ
  console.log(colors.yellow("\n🧹 クリーンアップ"));
  console.log("================================");
  
  await $`rm -rf ${tempDir}`;
  console.log(colors.green(`✅ 一時ファイルを削除しました`));
  
  console.log(colors.bold(colors.green("\n✨ すべてのデモが完了しました！\n")));
}

// スクリプトとして実行された場合
if (import.meta.main) {
  main().catch(error => {
    console.error(colors.red("エラー:"), error);
    process.exit(1);
  });
}

// カスタムシェル関数のエクスポート
export const shell = {
  // ファイルが存在するかチェック
  async exists(path: string): Promise<boolean> {
    try {
      await $`test -e ${path}`;
      return true;
    } catch {
      return false;
    }
  },
  
  // ディレクトリを安全に作成
  async mkdirSafe(path: string): Promise<void> {
    if (!(await this.exists(path))) {
      await $`mkdir -p ${path}`;
    }
  },
  
  // ファイルの行数を数える
  async countLines(file: string): Promise<number> {
    const result = await $`wc -l < ${file}`.text();
    return parseInt(result.trim());
  },
  
  // プロセスが実行中かチェック
  async isProcessRunning(name: string): Promise<boolean> {
    try {
      await $`pgrep ${name}`;
      return true;
    } catch {
      return false;
    }
  },
};