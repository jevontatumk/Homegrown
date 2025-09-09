@echo off
echo Starting Home Grown Development Server...
echo.

REM Add Node.js to PATH for this session
set PATH=%PATH%;C:\Program Files\nodejs

REM Navigate to project directory
cd /d "%~dp0"

REM Start the development server
npm run dev

pause


