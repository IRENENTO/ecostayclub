@echo off
REM EcoStay Club - Complete Setup Script (Windows)

echo.
echo 🌱 EcoStay Club - Complete Setup Script (Windows)
echo ================================================

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please configure .env file with your API keys
) else (
    echo ✅ .env file already exists
)

REM Create logs directory
if not exist logs mkdir logs

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start development:
echo    - Frontend only:     npm run dev
echo    - Backend only:      npm run dev:server
echo    - Both (recommended): npm run dev:full
echo.
echo 📊 Dashboard: http://localhost:5000/dashboard.html
echo 🌐 Main site: http://localhost:3000
echo.
pause
