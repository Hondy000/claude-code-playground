#!/usr/bin/env python3

# Standard library imports
import tkinter as tk
from tkinter import ttk

from .calculator import Calculator


class CalculatorGUI:
    """GUI付き電卓アプリケーション"""

    def __init__(self, root):
        self.root = root
        self.root.title("🧮 Python電卓")
        self.root.geometry("350x500")
        self.root.resizable(False, False)

        # 電卓のインスタンス
        self.calc = Calculator()

        # 現在の入力と演算子を保持
        self.current_input = ""
        self.pending_value = None
        self.pending_operation = None

        # UIを構築
        self.create_widgets()

        # キーボードイベントをバインド
        self.bind_keyboard_events()

    def create_widgets(self):
        """UIコンポーネントを作成"""
        # スタイル設定
        style = ttk.Style()
        style.theme_use("clam")

        # メインフレーム
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # ディスプレイ
        self.display_var = tk.StringVar(value="0")
        display = ttk.Entry(
            main_frame,
            textvariable=self.display_var,
            font=("Arial", 24),
            justify="right",
            state="readonly",
        )
        display.grid(row=0, column=0, columnspan=4, sticky=(tk.W, tk.E), pady=(0, 10))

        # ボタンのレイアウト
        buttons = [
            ("MC", 1, 0),
            ("MR", 1, 1),
            ("MS", 1, 2),
            ("C", 1, 3),
            ("7", 2, 0),
            ("8", 2, 1),
            ("9", 2, 2),
            ("÷", 2, 3),
            ("4", 3, 0),
            ("5", 3, 1),
            ("6", 3, 2),
            ("×", 3, 3),
            ("1", 4, 0),
            ("2", 4, 1),
            ("3", 4, 2),
            ("-", 4, 3),
            ("0", 5, 0),
            (".", 5, 1),
            ("=", 5, 2),
            ("+", 5, 3),
        ]

        # ボタンを作成
        for text, row, col in buttons:
            btn = tk.Button(
                main_frame,
                text=text,
                font=("Arial", 18),
                width=5,
                height=2,
                relief="raised",
                bd=2,
                bg="#f0f0f0",
                activebackground="#e0e0e0",
            )
            btn.grid(row=row, column=col, padx=2, pady=2)

            # ボタンのクリックイベントをバインド
            if text.isdigit() or text == ".":
                btn.config(command=lambda t=text: self.on_digit(t))
            elif text in ["÷", "×", "-", "+"]:
                btn.config(
                    bg="#ff9500",
                    fg="white",
                    activebackground="#ff7700",
                    command=lambda t=text: self.on_operation(t),
                )
            elif text == "=":
                btn.config(
                    bg="#4cd964",
                    fg="white",
                    activebackground="#3cb954",
                    command=self.on_equals,
                )
            elif text == "C":
                btn.config(
                    bg="#ff3b30",
                    fg="white",
                    activebackground="#dd2b20",
                    command=self.on_clear,
                )
            elif text == "MC":
                btn.config(command=self.on_memory_clear)
            elif text == "MR":
                btn.config(command=self.on_memory_recall)
            elif text == "MS":
                btn.config(command=self.on_memory_store)

    def bind_keyboard_events(self):
        """キーボードイベントをバインド"""
        self.root.bind("<Key>", self.on_key_press)
        self.root.bind("<Return>", lambda e: self.on_equals())
        self.root.bind("<BackSpace>", lambda e: self.on_backspace())
        self.root.bind("<Escape>", lambda e: self.on_clear())

    def on_key_press(self, event):
        """キーボード入力を処理"""
        key = event.char
        if key.isdigit() or key == ".":
            self.on_digit(key)
        elif key in ["+", "-", "*", "/"]:
            # キーボードの記号を電卓の記号に変換
            if key == "*":
                self.on_operation("×")
            elif key == "/":
                self.on_operation("÷")
            else:
                self.on_operation(key)

    def on_digit(self, digit):
        """数字または小数点が押されたときの処理"""
        if self.current_input == "0" and digit != ".":
            self.current_input = digit
        elif digit == "." and "." not in self.current_input:
            if self.current_input == "":
                self.current_input = "0."
            else:
                self.current_input += digit
        elif digit != ".":
            self.current_input += digit

        self.update_display(self.current_input)

    def on_operation(self, operation):
        """演算子が押されたときの処理"""
        if self.current_input:
            if self.pending_operation and self.pending_value is not None:
                # 連続計算の処理
                self.calculate()
            self.pending_value = float(self.current_input)
            self.pending_operation = operation
            self.current_input = ""

    def on_equals(self):
        """=が押されたときの処理"""
        if (
            self.pending_operation
            and self.pending_value is not None
            and self.current_input
        ):
            self.calculate()
            self.pending_operation = None
            self.pending_value = None

    def calculate(self):
        """計算を実行"""
        try:
            current_value = float(self.current_input)

            if self.pending_operation == "+":
                result = self.calc.add(self.pending_value, current_value)
            elif self.pending_operation == "-":
                result = self.calc.subtract(self.pending_value, current_value)
            elif self.pending_operation == "×":
                result = self.calc.multiply(self.pending_value, current_value)
            elif self.pending_operation == "÷":
                result = self.calc.divide(self.pending_value, current_value)

            # 整数の場合は整数として表示
            if result == int(result):
                self.current_input = str(int(result))
            else:
                self.current_input = str(result)

            self.update_display(self.current_input)

        except ZeroDivisionError:
            self.update_display("エラー")
            self.current_input = ""
        except Exception:
            self.update_display("エラー")
            self.current_input = ""

    def on_clear(self):
        """クリアボタンが押されたときの処理"""
        self.current_input = ""
        self.pending_value = None
        self.pending_operation = None
        self.calc.clear()
        self.update_display("0")

    def on_backspace(self):
        """バックスペースキーが押されたときの処理"""
        if self.current_input:
            self.current_input = self.current_input[:-1]
            if not self.current_input:
                self.update_display("0")
            else:
                self.update_display(self.current_input)

    def on_memory_store(self):
        """メモリに保存"""
        if self.current_input:
            self.calc.last_result = float(self.current_input)
            self.calc.memory_store()

    def on_memory_recall(self):
        """メモリから呼び出し"""
        value = self.calc.memory_recall()
        if value == int(value):
            self.current_input = str(int(value))
        else:
            self.current_input = str(value)
        self.update_display(self.current_input)

    def on_memory_clear(self):
        """メモリをクリア"""
        self.calc.memory_clear()

    def update_display(self, value):
        """ディスプレイを更新"""
        self.display_var.set(value)


def main():
    """メイン関数"""
    root = tk.Tk()
    CalculatorGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
