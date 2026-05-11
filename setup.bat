@echo off
REM TaskFlow Setup Script for Windows

echo.
echo 🚀 TaskFlow Setup
echo =================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install --prefix backend
call npm install --prefix frontend
echo ✅ Dependencies installed
echo.

REM Create database
echo 🗄️  Setting up database...
echo Note: Make sure PostgreSQL is running and psql is in your PATH
echo.

REM Run schema
echo 📋 Running schema...
psql -U postgres -d taskflow_db -f backend/schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Could not apply schema. Make sure:
    echo    1. PostgreSQL is running
    echo    2. Database 'taskflow_db' exists
    echo    3. psql is in your PATH
    echo.
    echo You can manually run: psql -U postgres -d taskflow_db -f backend/schema.sql
)
echo.

REM Create .env files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend\.env...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your DATABASE_URL and SESSION_SECRET
)

if not exist "frontend\.env" (
    echo 📝 Creating frontend\.env...
    copy frontend\.env.example frontend\.env
)

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Run: npm run dev --prefix backend
echo 3. In another terminal: npm run dev --prefix frontend
echo 4. Open http://localhost:5173
echo.
pause
