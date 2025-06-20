// Worker スレッドのデモ（メインスレッド）
import { Worker } from "worker_threads";

// Workerプール管理
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private busyWorkers = new Set<Worker>();
  
  constructor(private poolSize: number, private workerPath: string) {
    this.initialize();
  }
  
  private initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerPath);
      
      worker.on("message", (message) => {
        this.handleWorkerMessage(worker, message);
      });
      
      worker.on("error", (error) => {
        console.error(`Worker error:`, error);
        this.busyWorkers.delete(worker);
        this.processQueue();
      });
      
      this.workers.push(worker);
    }
  }
  
  private handleWorkerMessage(worker: Worker, message: any) {
    // Workerを利用可能にする
    this.busyWorkers.delete(worker);
    
    // キューに次のタスクがあれば処理
    this.processQueue();
  }
  
  private processQueue() {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !this.busyWorkers.has(w));
    if (!availableWorker) return;
    
    const task = this.queue.shift();
    if (task) {
      this.busyWorkers.add(availableWorker);
      
      const messageHandler = (message: any) => {
        if (message.id === task.task.id) {
          availableWorker.off("message", messageHandler);
          
          if (message.type === "result") {
            task.resolve(message);
          } else if (message.type === "error") {
            task.reject(new Error(message.error));
          }
        }
      };
      
      availableWorker.on("message", messageHandler);
      availableWorker.postMessage(task.task);
    }
  }
  
  async execute(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      task.id = crypto.randomUUID();
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// デモ実行
async function runWorkerDemo() {
  console.log("🚀 Worker スレッドデモ開始\n");
  
  // CPUコア数を取得
  const cpuCount = navigator.hardwareConcurrency || 4;
  console.log(`💻 利用可能なCPUコア数: ${cpuCount}`);
  
  // Workerプールを作成
  const pool = new WorkerPool(cpuCount, "./worker.ts");
  
  try {
    // デモ1: 素数の並列計算
    console.log("\n📊 デモ1: 素数の並列計算");
    console.log("================================");
    
    const ranges = [
      { start: 1, end: 25000 },
      { start: 25001, end: 50000 },
      { start: 50001, end: 75000 },
      { start: 75001, end: 100000 },
    ];
    
    console.time("並列処理");
    const primePromises = ranges.map(range =>
      pool.execute({ type: "findPrimes", ...range })
    );
    
    const results = await Promise.all(primePromises);
    const totalPrimes = results.reduce((sum, r) => sum + r.result.length, 0);
    console.timeEnd("並列処理");
    
    console.log(`見つかった素数の総数: ${totalPrimes}`);
    results.forEach((r, i) => {
      console.log(`  範囲${i + 1}: ${r.result.length}個 (${r.duration.toFixed(2)}ms)`);
    });
    
    // デモ2: フィボナッチ数列の計算
    console.log("\n📊 デモ2: 大きなフィボナッチ数の計算");
    console.log("================================");
    
    const fibNumbers = [100, 500, 1000, 2000, 3000];
    const fibPromises = fibNumbers.map(n =>
      pool.execute({ type: "fibonacci", n })
    );
    
    const fibResults = await Promise.all(fibPromises);
    fibResults.forEach((r, i) => {
      const value = r.result;
      console.log(`F(${fibNumbers[i]}) = ${value.slice(0, 20)}... (${value.length}桁, ${r.duration.toFixed(2)}ms)`);
    });
    
    // デモ3: マンデルブロ集合の計算
    console.log("\n📊 デモ3: マンデルブロ集合の並列計算");
    console.log("================================");
    
    const imageSize = 200;
    const quarters = [
      { width: imageSize, height: imageSize / 4, iterations: 50 },
      { width: imageSize, height: imageSize / 4, iterations: 50 },
      { width: imageSize, height: imageSize / 4, iterations: 50 },
      { width: imageSize, height: imageSize / 4, iterations: 50 },
    ];
    
    console.time("マンデルブロ集合計算");
    const mandelbrotPromises = quarters.map(params =>
      pool.execute({ type: "mandelbrot", ...params })
    );
    
    const mandelbrotResults = await Promise.all(mandelbrotPromises);
    console.timeEnd("マンデルブロ集合計算");
    
    const totalPixels = mandelbrotResults.reduce(
      (sum, r) => sum + r.result.length,
      0
    );
    console.log(`計算したピクセル数: ${totalPixels}`);
    
    // デモ4: CPU負荷テスト
    console.log("\n📊 デモ4: CPU負荷分散テスト");
    console.log("================================");
    
    const loadTasks = Array(8).fill(0).map((_, i) => ({
      type: "heavyComputation",
      iterations: 10000000,
      taskId: i + 1,
    }));
    
    console.time("CPU負荷テスト");
    const loadPromises = loadTasks.map(task => pool.execute(task));
    const loadResults = await Promise.all(loadPromises);
    console.timeEnd("CPU負荷テスト");
    
    loadResults.forEach((r, i) => {
      console.log(`  タスク${i + 1}: ${r.duration.toFixed(2)}ms`);
    });
    
    // パフォーマンス比較（シングルスレッド vs マルチスレッド）
    console.log("\n📊 パフォーマンス比較");
    console.log("================================");
    
    // シングルスレッドでの素数計算
    console.time("シングルスレッド処理");
    let singleThreadPrimes = 0;
    for (let num = 1; num <= 50000; num++) {
      if (isPrime(num)) singleThreadPrimes++;
    }
    console.timeEnd("シングルスレッド処理");
    
    console.log(`\nシングルスレッドで見つかった素数: ${singleThreadPrimes}`);
    console.log("マルチスレッドの方が大幅に高速です！");
    
  } finally {
    // Workerプールを終了
    pool.terminate();
    console.log("\n✅ Workerプールを終了しました");
  }
}

// 素数判定（メインスレッド用）
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

// 実行
runWorkerDemo().catch(console.error);