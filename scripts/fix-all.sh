#!/bin/bash

echo "🔧 Auto-fixing code..."
echo

echo "1. Black formatting..."
black apps/ tests/
echo "✓ Black formatting complete"
echo

echo "2. isort..."
isort apps/ tests/
echo "✓ Import sorting complete"
echo

echo "✅ Auto-fix complete! Please review changes with 'git diff'"