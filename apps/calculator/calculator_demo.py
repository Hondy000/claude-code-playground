#!/usr/bin/env python3

from .calculator import Calculator


def main():
    """電卓のデモンストレーション"""
    calc = Calculator()

    print("🧮 Python電卓デモ")
    print("=" * 40)

    print("\n基本的な計算:")
    print(f"5 + 3 = {calc.add(5, 3)}")
    print(f"10 - 4 = {calc.subtract(10, 4)}")
    print(f"7 × 6 = {calc.multiply(7, 6)}")
    print(f"20 ÷ 4 = {calc.divide(20, 4)}")
    print(f"2 ^ 8 = {calc.power(2, 8)}")

    print("\n連続計算の例:")
    result = calc.add(100, 50)
    print(f"100 + 50 = {result}")
    result = calc.multiply(result, 2)
    print(f"前の結果 × 2 = {result}")
    result = calc.subtract(result, 100)
    print(f"前の結果 - 100 = {result}")

    print("\nメモリ機能の例:")
    calc.add(123, 456)
    print(f"123 + 456 = {calc.last_result}")
    calc.memory_store()
    print("→ メモリに保存")

    calc.multiply(10, 20)
    print(f"\n別の計算: 10 × 20 = {calc.last_result}")

    print(f"メモリから呼び出し: {calc.memory_recall()}")

    print("\n小数の計算:")
    print(f"3.14 × 2 = {calc.multiply(3.14, 2)}")
    print(f"10.5 ÷ 2.5 = {calc.divide(10.5, 2.5)}")

    print("\nゼロ除算のエラー処理:")
    try:
        calc.divide(10, 0)
    except ZeroDivisionError as e:
        print(f"エラー: {e}")

    print("\n=" * 40)
    print("デモ終了！")


if __name__ == "__main__":
    main()
