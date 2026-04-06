@echo off
echo ====================================
echo   Starting Magical Coloring Book
echo ====================================
echo.

cd /d "%~dp0"

echo Installing dependencies...
call npm install

echo.
echo Starting dev server on http://localhost:5050
echo.
call npm run dev
