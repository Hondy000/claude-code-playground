#!/usr/bin/env python3


class Calculator:
    """シンプルな電卓クラス"""

    def __init__(self):
        self.memory = 0
        self.last_result = 0

    def add(self, a, b):
        """足し算"""
        result = a + b
        self.last_result = result
        return result

    def subtract(self, a, b):
        """引き算"""
        result = a - b
        self.last_result = result
        return result

    def multiply(self, a, b):
        """掛け算"""
        result = a * b
        self.last_result = result
        return result

    def divide(self, a, b):
        """割り算"""
        if b == 0:
            raise ZeroDivisionError("ゼロで割ることはできません")
        result = a / b
        self.last_result = result
        return result

    def power(self, a, b):
        """累乗"""
        result = a**b
        self.last_result = result
        return result

    def clear(self):
        """クリア（リセット）"""
        self.last_result = 0
        return 0

    def memory_store(self):
        """現在の結果をメモリに保存"""
        self.memory = self.last_result
        return self.memory

    def memory_recall(self):
        """メモリから値を呼び出し"""
        return self.memory

    def memory_clear(self):
        """メモリをクリア"""
        self.memory = 0
        return 0
