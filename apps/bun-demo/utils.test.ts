import { describe, test, expect, mock } from 'bun:test';
import {
  add,
  multiply,
  divide,
  isPrime,
  fibonacci,
  reverseString,
  parseJSON,
  delay,
  debounce,
} from './utils';

// 基本的な算術演算のテスト
describe('算術演算', () => {
  test('足し算が正しく動作する', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('掛け算が正しく動作する', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 5)).toBe(0);
  });

  test('割り算が正しく動作する', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(7, 2)).toBe(3.5);
    expect(divide(-10, 2)).toBe(-5);
  });

  test('ゼロ除算でエラーが発生する', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});

// 素数判定のテスト
describe('素数判定', () => {
  test('素数を正しく判定する', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(11)).toBe(true);
    expect(isPrime(13)).toBe(true);
  });

  test('素数でない数を正しく判定する', () => {
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(6)).toBe(false);
    expect(isPrime(8)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(10)).toBe(false);
  });

  test('負の数と0は素数ではない', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(-1)).toBe(false);
    expect(isPrime(-7)).toBe(false);
  });
});

// フィボナッチ数列のテスト
describe('フィボナッチ数列', () => {
  test('正しいフィボナッチ数を返す', () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(2)).toBe(1);
    expect(fibonacci(3)).toBe(2);
    expect(fibonacci(4)).toBe(3);
    expect(fibonacci(5)).toBe(5);
    expect(fibonacci(6)).toBe(8);
  });
});

// 文字列操作のテスト
describe('文字列操作', () => {
  test('文字列を正しく反転する', () => {
    expect(reverseString('hello')).toBe('olleh');
    expect(reverseString('Bun')).toBe('nuB');
    expect(reverseString('12345')).toBe('54321');
    expect(reverseString('')).toBe('');
  });

  test('日本語も正しく反転する', () => {
    expect(reverseString('こんにちは')).toBe('はちにんこ');
  });
});

// JSON解析のテスト
describe('JSON解析', () => {
  test('有効なJSONを解析する', () => {
    const result1 = parseJSON<{ name: string }>('{"name": "Bun"}');
    expect(result1).toEqual({ name: 'Bun' });

    const result2 = parseJSON<number[]>('[1, 2, 3]');
    expect(result2).toEqual([1, 2, 3]);

    const result3 = parseJSON<string>('"hello"');
    expect(result3).toBe('hello');

    const result4 = parseJSON<number>('123');
    expect(result4).toBe(123);

    const result5 = parseJSON<boolean>('true');
    expect(result5).toBe(true);

    const result6 = parseJSON<null>('null');
    expect(result6).toBe(null);
  });

  test('無効なJSONはnullを返す', () => {
    expect(parseJSON('invalid json')).toBe(null);
    expect(parseJSON("{name: 'Bun'}")).toBe(null);
    expect(parseJSON('undefined')).toBe(null);
  });
});

// 非同期関数のテスト
describe('非同期処理', () => {
  test('delayが指定時間待機する', async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();

    // 誤差を考慮して90ms以上経過していることを確認
    expect(end - start).toBeGreaterThanOrEqual(90);
  });
});

// モック機能のテスト
describe('モック機能', () => {
  test('関数をモックできる', () => {
    const mockFn = mock(() => 'mocked');

    expect(mockFn()).toBe('mocked');
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('モックの引数を検証できる', () => {
    const mockFn = mock((a: number, b: number) => a + b);

    mockFn(1, 2);
    mockFn(3, 4);

    expect(mockFn).toHaveBeenCalledWith(1, 2);
    expect(mockFn).toHaveBeenCalledWith(3, 4);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

// デバウンスのテスト
describe('デバウンス', () => {
  test('連続呼び出しで最後の呼び出しのみ実行される', async () => {
    let count = 0;
    const increment = () => count++;
    const debouncedIncrement = debounce(increment, 50);

    // 連続で3回呼び出す
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    // まだ実行されていない
    expect(count).toBe(0);

    // 十分な時間待つ
    await delay(100);

    // 1回だけ実行された
    expect(count).toBe(1);
  });
});

// スナップショットテスト
describe('スナップショットテスト', () => {
  test('オブジェクトのスナップショット', () => {
    const data = {
      name: 'Bun Test',
      version: '1.0.0',
      features: ['fast', 'typescript', 'test-runner'],
    };

    // スナップショットと比較
    expect(data).toMatchSnapshot();
  });
});
