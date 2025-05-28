#!/usr/bin/env python3
import unittest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock

# srcディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

# tkinterをモック化（GUIテスト環境がない場合でもテスト可能に）
sys.modules['tkinter'] = MagicMock()
sys.modules['tkinter.ttk'] = MagicMock()

from calculator_gui import CalculatorGUI
from calculator import Calculator


class TestCalculatorGUI(unittest.TestCase):
    """GUI電卓のロジックテスト"""
    
    def setUp(self):
        """各テストの前にモックのrootとGUIインスタンスを作成"""
        self.mock_root = Mock()
        self.mock_root.title = Mock()
        self.mock_root.geometry = Mock()
        self.mock_root.resizable = Mock()
        self.mock_root.bind = Mock()
        self.mock_root.mainloop = Mock()
        
        # StringVarのモック
        self.mock_string_var = Mock()
        self.mock_string_var.set = Mock()
        self.mock_string_var.get = Mock(return_value="0")
        
        with patch('calculator_gui.tk.StringVar', return_value=self.mock_string_var):
            self.gui = CalculatorGUI(self.mock_root)
    
    # 数字入力のテスト
    def test_digit_input(self):
        """数字入力のテスト"""
        # 最初の数字を入力
        self.gui.on_digit('5')
        self.assertEqual(self.gui.current_input, '5')
        
        # 複数の数字を入力
        self.gui.on_digit('2')
        self.gui.on_digit('3')
        self.assertEqual(self.gui.current_input, '523')
    
    def test_decimal_input(self):
        """小数点入力のテスト"""
        # 整数の後に小数点
        self.gui.on_digit('3')
        self.gui.on_digit('.')
        self.gui.on_digit('1')
        self.gui.on_digit('4')
        self.assertEqual(self.gui.current_input, '3.14')
        
        # 重複する小数点は無視される
        self.gui.on_digit('.')
        self.assertEqual(self.gui.current_input, '3.14')
    
    def test_leading_zero_replacement(self):
        """先頭の0が置き換えられるテスト"""
        self.gui.current_input = "0"
        self.gui.on_digit('5')
        self.assertEqual(self.gui.current_input, '5')
    
    # 演算のテスト
    def test_addition(self):
        """足し算のテスト"""
        self.gui.on_digit('5')
        self.gui.on_operation('+')
        self.gui.on_digit('3')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '8')
    
    def test_subtraction(self):
        """引き算のテスト"""
        self.gui.on_digit('1')
        self.gui.on_digit('0')
        self.gui.on_operation('-')
        self.gui.on_digit('4')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '6')
    
    def test_multiplication(self):
        """掛け算のテスト"""
        self.gui.on_digit('7')
        self.gui.on_operation('×')
        self.gui.on_digit('6')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '42')
    
    def test_division(self):
        """割り算のテスト"""
        self.gui.on_digit('2')
        self.gui.on_digit('0')
        self.gui.on_operation('÷')
        self.gui.on_digit('4')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '5')
    
    def test_division_by_zero(self):
        """ゼロ除算のテスト"""
        self.gui.on_digit('1')
        self.gui.on_digit('0')
        self.gui.on_operation('÷')
        self.gui.on_digit('0')
        self.gui.on_equals()
        # エラー処理により current_input は空になる
        self.assertEqual(self.gui.current_input, '')
    
    # 連続計算のテスト
    def test_chain_calculation(self):
        """連続計算のテスト"""
        # 5 + 3 = 8
        self.gui.on_digit('5')
        self.gui.on_operation('+')
        self.gui.on_digit('3')
        self.gui.on_operation('+')  # 次の演算子で自動的に計算
        # 連続計算後、pending_value が 8 になっているはず
        self.assertEqual(self.gui.pending_value, 8)
        
        # 8 + 2 = 10
        self.gui.on_digit('2')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '10')
    
    # クリア機能のテスト
    def test_clear(self):
        """クリア機能のテスト"""
        self.gui.on_digit('1')
        self.gui.on_digit('2')
        self.gui.on_digit('3')
        self.gui.on_clear()
        self.assertEqual(self.gui.current_input, '')
        self.assertIsNone(self.gui.pending_value)
        self.assertIsNone(self.gui.pending_operation)
    
    # メモリ機能のテスト
    def test_memory_operations(self):
        """メモリ機能のテスト"""
        # 数値をメモリに保存
        self.gui.on_digit('4')
        self.gui.on_digit('2')
        self.gui.on_memory_store()
        
        # 別の計算
        self.gui.on_digit('1')
        self.gui.on_digit('0')
        
        # メモリから呼び出し
        self.gui.on_memory_recall()
        self.assertEqual(self.gui.current_input, '42')
        
        # メモリクリア
        self.gui.on_memory_clear()
        self.gui.on_memory_recall()
        self.assertEqual(self.gui.current_input, '0')
    
    # キーボード入力のテスト
    def test_keyboard_digit_input(self):
        """キーボードからの数字入力テスト"""
        event = Mock()
        event.char = '7'
        self.gui.on_key_press(event)
        self.assertEqual(self.gui.current_input, '7')
    
    def test_keyboard_operator_input(self):
        """キーボードからの演算子入力テスト"""
        # 掛け算の変換テスト
        self.gui.on_digit('6')
        event = Mock()
        event.char = '*'
        self.gui.on_key_press(event)
        self.assertEqual(self.gui.pending_operation, '×')
        
        # 割り算の変換テスト
        self.gui.on_digit('3')
        event = Mock()
        event.char = '/'
        self.gui.on_key_press(event)
        self.assertEqual(self.gui.pending_operation, '÷')
    
    def test_keyboard_addition(self):
        """キーボードからの足し算テスト"""
        event = Mock()
        
        # 5を入力
        event.char = '5'
        self.gui.on_key_press(event)
        
        # +を入力
        event.char = '+'
        self.gui.on_key_press(event)
        
        # 3を入力
        event.char = '3'
        self.gui.on_key_press(event)
        
        # Enterキーで計算
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '8')
    
    def test_backspace(self):
        """バックスペースキーのテスト"""
        self.gui.on_digit('1')
        self.gui.on_digit('2')
        self.gui.on_digit('3')
        self.gui.on_backspace()
        self.assertEqual(self.gui.current_input, '12')
        
        # すべて削除したら0を表示
        self.gui.on_backspace()
        self.gui.on_backspace()
        self.mock_string_var.set.assert_called_with('0')
    
    # エッジケースのテスト
    def test_decimal_only_input(self):
        """小数点のみの入力テスト"""
        self.gui.current_input = ""
        self.gui.on_digit('.')
        self.assertEqual(self.gui.current_input, '0.')
    
    def test_integer_display(self):
        """整数は整数として表示されるテスト"""
        self.gui.on_digit('5')
        self.gui.on_operation('+')
        self.gui.on_digit('5')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '10')  # 10.0ではなく10
    
    def test_float_display(self):
        """小数は小数として表示されるテスト"""
        self.gui.on_digit('5')
        self.gui.on_operation('÷')
        self.gui.on_digit('2')
        self.gui.on_equals()
        self.assertEqual(self.gui.current_input, '2.5')


if __name__ == "__main__":
    unittest.main()