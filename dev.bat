@echo off
REM EcoStay Club - Full Stack Platform
REM Development & Deployment Assistant

cls
color 0A
echo.
echo ╔════════════════════════════════════════════════╗
echo ║   🌱 EcoStay Club - Full Stack Platform 🌱     ║
echo ║        Development ^& Deployment Assistant     ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js not found
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION%
echo ✅ npm %NPM_VERSION%
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Initialize database
if not exist db.json (
    echo 🗄️  Initializing database...
    node init-db.js
    echo.
)

REM Create .env if needed
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please configure .env with your API keys
    echo.
)

echo ✅ All systems ready!
echo.
echo 🚀 Starting Full Stack Application...
echo.
echo 📊 Dashboard:    http://localhost:5000/dashboard.html
echo 🌐 Frontend:     http://localhost:3000
echo 🔌 API:          http://localhost:5000/api
echo.
echo 🔐 Default Login:
echo    Email:    admin@ecostay.org
echo    Password: Admin123
echo.
echo 📚 Documentation:
echo    - QUICK_START.md         ^> Get started in 5 minutes
echo    - DEPLOYMENT_GUIDE.md    ^> Deploy to production
echo    - API_DOCS.md            ^> API reference
echo    - PROJECT_SUMMARY.md     ^> What's been built
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev:full
pause
