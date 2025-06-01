@echo off
chcp 65001 > nul
echo.
echo 🎤 VibeCode - バイブコーディング ランディングページを起動します...
echo.

:: Node.jsがインストールされているか確認
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.jsがインストールされていません。
    echo 👉 https://nodejs.org/ からNode.jsをインストールしてください。
    pause
    exit /b 1
)

:: npmがインストールされているか確認
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npmがインストールされていません。
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo 📦 Node.js %NODE_VERSION% / npm %NPM_VERSION% を検出しました
echo.

:: 依存関係のインストール
if not exist "node_modules\" (
    echo 📥 依存関係をインストールしています...
    call npm install
    echo.
) else (
    echo ✅ 依存関係は既にインストールされています
    echo.
)

:: ポート3000が使用中かチェック
netstat -aon | findstr :3000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  ポート3000が既に使用されています
    echo 👉 別のポートで起動します ^(ポート3001^)
    set PORT=3001
    call npm run dev
) else (
    echo 🚀 開発サーバーを起動しています...
    echo.
    echo 📱 ブラウザで以下のURLにアクセスしてください：
    echo    http://localhost:3000
    echo.
    echo 🛑 サーバーを停止するには Ctrl+C を押してください
    echo.
    call npm run dev
)