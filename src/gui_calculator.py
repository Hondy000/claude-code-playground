#!/usr/bin/env python3
import tkinter as tk
from tkinter import ttk
import math


class CalculatorGUI:
    """tkinterを使った電卓GUI"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("電卓")
        self.root.geometry("300x400")
        
        # 計算用の変数
        self.current_number = ""
        self.first_number = None
        self.operation = None
        self.should_reset = False
        
        # ディスプレイ
        self.display = tk.Entry(root, font=("Arial", 20), justify="right")
        self.display.grid(row=0, column=0, columnspan=4, padx=5, pady=5, sticky="we")
        self.display.insert(0, "0")
        
        # ボタンの作成
        self.create_buttons()
        
        # キーボードバインディング
        self.bind_keyboard()
    
    def create_buttons(self):
        """ボタンの作成と配置"""
        # ボタンのレイアウト
        buttons = [
            ['C', '±', '%', '÷'],
            ['7', '8', '9', '×'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '+'],
            ['0', '.', '=']
        ]
        
        # ボタンを配置
        for i, row in enumerate(buttons):
            for j, text in enumerate(row):
                if text == '0':
                    btn = tk.Button(self.root, text=text, font=("Arial", 18),
                                  command=lambda t=text: self.button_click(t))
                    btn.grid(row=i+1, column=j, columnspan=2, padx=1, pady=1, sticky="nsew")
                elif text == '=':
                    btn = tk.Button(self.root, text=text, font=("Arial", 18),
                                  command=lambda t=text: self.button_click(t))
                    btn.grid(row=i+1, column=j+1, columnspan=2, padx=1, pady=1, sticky="nsew")
                else:
                    btn = tk.Button(self.root, text=text, font=("Arial", 18),
                                  command=lambda t=text: self.button_click(t))
                    btn.grid(row=i+1, column=j, padx=1, pady=1, sticky="nsew")
        
        # グリッドの設定
        for i in range(5):
            self.root.grid_rowconfigure(i+1, weight=1)
        for i in range(4):
            self.root.grid_columnconfigure(i, weight=1)
    
    def bind_keyboard(self):
        """キーボードイベントのバインディング"""
        self.root.bind('<Key>', self.key_press)
        self.root.bind('<Return>', lambda e: self.button_click('='))
        self.root.bind('<BackSpace>', lambda e: self.backspace())
        self.root.bind('<Escape>', lambda e: self.button_click('C'))
    
    def key_press(self, event):
        """キーボード入力の処理"""
        key = event.char
        if key in '0123456789':
            self.button_click(key)
        elif key == '.':
            self.button_click('.')
        elif key in '+-*/':
            operations = {'+': '+', '-': '-', '*': '×', '/': '÷'}
            self.button_click(operations[key])
        elif key == '=' or key == '\r':
            self.button_click('=')
        elif key == '%':
            self.button_click('%')
    
    def button_click(self, value):
        """ボタンクリックの処理"""
        if value in '0123456789':
            self.number_click(value)
        elif value == '.':
            self.decimal_click()
        elif value in '+-×÷':
            self.operation_click(value)
        elif value == '=':
            self.equals_click()
        elif value == 'C':
            self.clear_click()
        elif value == '±':
            self.negate_click()
        elif value == '%':
            self.percent_click()
    
    def number_click(self, number):
        """数字ボタンの処理"""
        if self.should_reset:
            self.current_number = ""
            self.should_reset = False
        
        self.current_number += number
        self.update_display(self.current_number)
    
    def decimal_click(self):
        """小数点ボタンの処理"""
        if self.should_reset:
            self.current_number = "0"
            self.should_reset = False
        
        if '.' not in self.current_number:
            if self.current_number == "":
                self.current_number = "0"
            self.current_number += '.'
            self.update_display(self.current_number)
    
    def operation_click(self, op):
        """演算子ボタンの処理"""
        if self.current_number or self.first_number is not None:
            if self.first_number is not None and not self.should_reset:
                self.equals_click()
            
            self.first_number = float(self.display.get())
            self.operation = op
            self.should_reset = True
    
    def equals_click(self):
        """イコールボタンの処理"""
        if self.first_number is not None and self.operation:
            try:
                second_number = float(self.display.get())
                result = self.calculate(self.first_number, second_number, self.operation)
                self.update_display(str(result))
                self.first_number = None
                self.operation = None
                self.current_number = str(result)
                self.should_reset = True
            except ZeroDivisionError:
                self.update_display("エラー")
                self.clear_click()
    
    def calculate(self, first, second, operation):
        """計算の実行"""
        if operation == '+':
            return first + second
        elif operation == '-':
            return first - second
        elif operation == '×':
            return first * second
        elif operation == '÷':
            if second == 0:
                raise ZeroDivisionError
            return first / second
    
    def clear_click(self):
        """クリアボタンの処理"""
        self.current_number = ""
        self.first_number = None
        self.operation = None
        self.should_reset = False
        self.update_display("0")
    
    def negate_click(self):
        """符号反転ボタンの処理"""
        current = float(self.display.get())
        self.update_display(str(-current))
        self.current_number = str(-current)
    
    def percent_click(self):
        """パーセントボタンの処理"""
        current = float(self.display.get())
        self.update_display(str(current / 100))
        self.current_number = str(current / 100)
    
    def backspace(self):
        """バックスペースの処理"""
        if not self.should_reset and self.current_number:
            self.current_number = self.current_number[:-1]
            if self.current_number == "":
                self.update_display("0")
            else:
                self.update_display(self.current_number)
    
    def update_display(self, value):
        """ディスプレイの更新"""
        self.display.delete(0, tk.END)
        self.display.insert(0, value)
    
    def get_display_value(self):
        """ディスプレイの値を取得（テスト用）"""
        return self.display.get()


def main():
    root = tk.Tk()
    app = CalculatorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()