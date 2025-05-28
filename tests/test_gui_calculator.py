#!/usr/bin/env python3
import unittest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
import tkinter as tk

# srcディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from gui_calculator import CalculatorGUI


class TestCalculatorGUI(unittest.TestCase):
    """GUI電卓のテスト"""
    
    def setUp(self):
        """各テストの前にGUIを初期化"""
        self.root = tk.Tk()
        self.calculator = CalculatorGUI(self.root)
    
    def tearDown(self):
        """各テストの後にGUIを破棄"""
        self.root.destroy()
    
    # ディスプレイのテスト
    def test_initial_display(self):
        """初期表示のテスト"""
        self.assertEqual(self.calculator.get_display_value(), "0")
    
    def test_update_display(self):
        """ディスプレイ更新のテスト"""
        self.calculator.update_display("123")
        self.assertEqual(self.calculator.get_display_value(), "123")
    
    # 数字入力のテスト
    def test_number_input(self):
        """数字入力のテスト"""
        self.calculator.button_click("1")
        self.assertEqual(self.calculator.get_display_value(), "1")
        
        self.calculator.button_click("2")
        self.assertEqual(self.calculator.get_display_value(), "12")
        
        self.calculator.button_click("3")
        self.assertEqual(self.calculator.get_display_value(), "123")
    
    def test_decimal_input(self):
        """小数点入力のテスト"""
        self.calculator.button_click("1")
        self.calculator.button_click(".")
        self.calculator.button_click("5")
        self.assertEqual(self.calculator.get_display_value(), "1.5")
    
    def test_multiple_decimal_prevention(self):
        """複数の小数点を防ぐテスト"""
        self.calculator.button_click("1")
        self.calculator.button_click(".")
        self.calculator.button_click("5")
        self.calculator.button_click(".")
        self.calculator.button_click("3")
        self.assertEqual(self.calculator.get_display_value(), "1.53")
    
    # 基本演算のテスト
    def test_addition(self):
        """足し算のテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("+")
        self.calculator.button_click("3")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "8.0")
    
    def test_subtraction(self):
        """引き算のテスト"""
        self.calculator.button_click("8")
        self.calculator.button_click("-")
        self.calculator.button_click("3")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "5.0")
    
    def test_multiplication(self):
        """掛け算のテスト"""
        self.calculator.button_click("4")
        self.calculator.button_click("×")
        self.calculator.button_click("3")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "12.0")
    
    def test_division(self):
        """割り算のテスト"""
        self.calculator.button_click("8")
        self.calculator.button_click("÷")
        self.calculator.button_click("2")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "4.0")
    
    def test_division_by_zero(self):
        """ゼロ除算のテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("÷")
        self.calculator.button_click("0")
        self.calculator.button_click("=")
        # エラー後はクリアされる
        self.assertEqual(self.calculator.first_number, None)
    
    # 特殊機能のテスト
    def test_clear_button(self):
        """クリアボタンのテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("+")
        self.calculator.button_click("3")
        self.calculator.button_click("C")
        self.assertEqual(self.calculator.get_display_value(), "0")
        self.assertEqual(self.calculator.first_number, None)
        self.assertEqual(self.calculator.operation, None)
    
    def test_negate_button(self):
        """符号反転ボタンのテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("±")
        self.assertEqual(self.calculator.get_display_value(), "-5.0")
    
    def test_percent_button(self):
        """パーセントボタンのテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("0")
        self.calculator.button_click("%")
        self.assertEqual(self.calculator.get_display_value(), "0.5")
    
    # 連続計算のテスト
    def test_chain_calculations(self):
        """連続計算のテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("+")
        self.calculator.button_click("3")
        self.calculator.button_click("+")  # ここで自動的に前の計算が実行される
        self.assertEqual(self.calculator.get_display_value(), "8.0")
        
        self.calculator.button_click("2")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "10.0")
    
    # キーボード入力のテスト
    def test_keyboard_number_input(self):
        """キーボードでの数字入力テスト"""
        event = Mock()
        event.char = "5"
        self.calculator.key_press(event)
        self.assertEqual(self.calculator.get_display_value(), "5")
    
    def test_keyboard_operation_input(self):
        """キーボードでの演算子入力テスト"""
        # 5を入力
        event = Mock()
        event.char = "5"
        self.calculator.key_press(event)
        
        # +を入力
        event.char = "+"
        self.calculator.key_press(event)
        
        # 3を入力
        event.char = "3"
        self.calculator.key_press(event)
        
        # =を入力
        event.char = "="
        self.calculator.key_press(event)
        
        self.assertEqual(self.calculator.get_display_value(), "8.0")
    
    def test_keyboard_multiplication(self):
        """キーボードでの掛け算入力テスト"""
        event = Mock()
        event.char = "4"
        self.calculator.key_press(event)
        
        event.char = "*"
        self.calculator.key_press(event)
        
        event.char = "3"
        self.calculator.key_press(event)
        
        event.char = "="
        self.calculator.key_press(event)
        
        self.assertEqual(self.calculator.get_display_value(), "12.0")
    
    def test_keyboard_division(self):
        """キーボードでの割り算入力テスト"""
        event = Mock()
        event.char = "8"
        self.calculator.key_press(event)
        
        event.char = "/"
        self.calculator.key_press(event)
        
        event.char = "2"
        self.calculator.key_press(event)
        
        event.char = "="
        self.calculator.key_press(event)
        
        self.assertEqual(self.calculator.get_display_value(), "4.0")
    
    def test_backspace(self):
        """バックスペースのテスト"""
        self.calculator.button_click("1")
        self.calculator.button_click("2")
        self.calculator.button_click("3")
        self.calculator.backspace()
        self.assertEqual(self.calculator.get_display_value(), "12")
        
        self.calculator.backspace()
        self.assertEqual(self.calculator.get_display_value(), "1")
        
        self.calculator.backspace()
        self.assertEqual(self.calculator.get_display_value(), "0")
    
    # エッジケースのテスト
    def test_decimal_only_input(self):
        """小数点のみ入力時のテスト"""
        self.calculator.button_click(".")
        self.assertEqual(self.calculator.get_display_value(), "0.")
    
    def test_multiple_operations(self):
        """複数の演算子を連続で押した場合のテスト"""
        self.calculator.button_click("5")
        self.calculator.button_click("+")
        self.calculator.button_click("-")  # 演算子を変更
        self.calculator.button_click("3")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "2.0")


class TestCalculatorGUIIntegration(unittest.TestCase):
    """GUI統合テスト"""
    
    def setUp(self):
        """GUIのセットアップ"""
        self.root = tk.Tk()
        self.calculator = CalculatorGUI(self.root)
    
    def tearDown(self):
        """GUIの破棄"""
        self.root.destroy()
    
    def test_complex_calculation(self):
        """複雑な計算のテスト"""
        # (10 + 5) × 2 - 8 ÷ 4 = 28
        self.calculator.button_click("1")
        self.calculator.button_click("0")
        self.calculator.button_click("+")
        self.calculator.button_click("5")
        self.calculator.button_click("×")
        self.calculator.button_click("2")
        self.calculator.button_click("-")
        self.calculator.button_click("8")
        self.calculator.button_click("÷")
        self.calculator.button_click("4")
        self.calculator.button_click("=")
        self.assertEqual(self.calculator.get_display_value(), "28.0")


if __name__ == "__main__":
    unittest.main()