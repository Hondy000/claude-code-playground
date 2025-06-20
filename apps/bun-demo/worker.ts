// Workerスレッド（重い計算処理を行う）

// 素数を計算する重い処理
function findPrimesInRange(start: number, end: number): number[] {
  const primes: number[] = [];
  
  for (let num = start; num <= end; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  
  return primes;
}

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

// フィボナッチ数列の計算（メモ化あり）
const fibCache = new Map<number, bigint>();
function fibonacci(n: number): bigint {
  if (n <= 1) return BigInt(n);
  
  if (fibCache.has(n)) {
    return fibCache.get(n)!;
  }
  
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fibCache.set(n, result);
  return result;
}

// マンデルブロ集合の計算
function calculateMandelbrot(
  width: number,
  height: number,
  maxIterations: number = 100
): Uint8Array {
  const buffer = new Uint8Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cx = (x / width) * 3.5 - 2.5;
      const cy = (y / height) * 2 - 1;
      
      let zx = 0;
      let zy = 0;
      let iteration = 0;
      
      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        iteration++;
      }
      
      buffer[y * width + x] = (iteration / maxIterations) * 255;
    }
  }
  
  return buffer;
}

// Workerメッセージハンドラー
self.onmessage = async (event: MessageEvent) => {
  const { type, id, ...params } = event.data;
  
  try {
    let result: any;
    const startTime = performance.now();
    
    switch (type) {
      case "findPrimes":
        result = findPrimesInRange(params.start, params.end);
        break;
        
      case "fibonacci":
        result = fibonacci(params.n).toString();
        break;
        
      case "mandelbrot":
        result = calculateMandelbrot(params.width, params.height, params.iterations);
        break;
        
      case "heavyComputation":
        // CPUを使う重い計算のシミュレーション
        let sum = 0;
        for (let i = 0; i < params.iterations; i++) {
          sum += Math.sqrt(i) * Math.sin(i);
        }
        result = sum;
        break;
        
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    const endTime = performance.now();
    
    self.postMessage({
      id,
      type: "result",
      result,
      duration: endTime - startTime,
    });
    
  } catch (error) {
    self.postMessage({
      id,
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};