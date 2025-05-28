#!/bin/bash
set -e

echo "🔍 Running all checks..."
echo

echo "1. Black (format check)..."
black --check apps/ tests/
echo "✓ Black check passed"
echo

echo "2. isort (import sort check)..."
isort --check-only apps/ tests/
echo "✓ isort check passed"
echo

echo "3. Flake8 (lint)..."
flake8 apps/ tests/
echo "✓ Flake8 check passed"
echo

echo "4. Bandit (security)..."
bandit -r apps/ -ll
echo "✓ Bandit check passed"
echo

echo "5. Tests..."
python -m unittest discover -s tests -p "test_*.py" -v
echo "✓ All tests passed"
echo

echo "✅ All checks passed! Ready to commit."