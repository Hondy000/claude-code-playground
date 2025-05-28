#!/usr/bin/env python3
# Standard library imports
import sys
import unittest
from pathlib import Path

# appsディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Local application imports
from apps.calculator import Calculator


class TestCalculator(unittest.TestCase):
    """電卓クラスのテスト"""

    def setUp(self):
        """各テストの前に新しい電卓インスタンスを作成"""
        self.calc = Calculator()

    # 基本的な四則演算のテスト
    def test_addition(self):
        """足し算のテスト"""
        self.assertEqual(self.calc.add(2, 3), 5)
        self.assertEqual(self.calc.add(-1, 1), 0)
        self.assertAlmostEqual(self.calc.add(0.1, 0.2), 0.3)

    def test_subtraction(self):
        """引き算のテスト"""
        self.assertEqual(self.calc.subtract(5, 3), 2)
        self.assertEqual(self.calc.subtract(1, 5), -4)
        self.assertEqual(self.calc.subtract(10.5, 0.5), 10.0)

    def test_multiplication(self):
        """掛け算のテスト"""
        self.assertEqual(self.calc.multiply(3, 4), 12)
        self.assertEqual(self.calc.multiply(-2, 3), -6)
        self.assertEqual(self.calc.multiply(2.5, 2), 5.0)

    def test_division(self):
        """割り算のテスト"""
        self.assertEqual(self.calc.divide(10, 2), 5)
        self.assertEqual(self.calc.divide(7, 2), 3.5)
        self.assertEqual(self.calc.divide(-10, 2), -5)

    def test_division_by_zero(self):
        """ゼロ除算のテスト"""
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    # 追加機能のテスト
    def test_power(self):
        """累乗のテスト"""
        self.assertEqual(self.calc.power(2, 3), 8)
        self.assertEqual(self.calc.power(5, 0), 1)
        self.assertEqual(self.calc.power(10, -1), 0.1)

    def test_clear(self):
        """クリア機能のテスト"""
        self.calc.add(5, 3)  # 結果は8
        self.assertEqual(self.calc.clear(), 0)
        self.assertEqual(self.calc.last_result, 0)

    # メモリ機能のテスト
    def test_memory_operations(self):
        """メモリ機能のテスト"""
        # 計算して結果を保存
        self.calc.add(10, 5)  # 結果は15
        self.assertEqual(self.calc.memory_store(), 15)

        # 別の計算をする
        self.calc.multiply(3, 4)  # 結果は12

        # メモリから呼び出し
        self.assertEqual(self.calc.memory_recall(), 15)

        # メモリクリア
        self.assertEqual(self.calc.memory_clear(), 0)
        self.assertEqual(self.calc.memory_recall(), 0)

    # 連続計算のテスト
    def test_chain_calculations(self):
        """連続計算のテスト"""
        result1 = self.calc.add(5, 3)  # 8
        result2 = self.calc.multiply(result1, 2)  # 16
        result3 = self.calc.subtract(result2, 6)  # 10
        self.assertEqual(result3, 10)
        self.assertEqual(self.calc.last_result, 10)

    # エッジケースのテスト
    def test_large_numbers(self):
        """大きな数値のテスト"""
        self.assertEqual(self.calc.add(1e10, 1e10), 2e10)
        self.assertEqual(self.calc.multiply(1e5, 1e5), 1e10)

    def test_small_numbers(self):
        """小さな数値のテスト"""
        self.assertAlmostEqual(self.calc.add(1e-10, 1e-10), 2e-10)
        self.assertEqual(self.calc.divide(1, 1000000), 1e-6)


if __name__ == "__main__":
    unittest.main()
