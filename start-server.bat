@echo off
cd /d "%~dp0"
echo ========================================
echo  Ebenezer Baptist Church - Dev Server
echo ========================================
echo.
echo Starting development server (Webpack bundler)...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
if errorlevel 1 (
    echo.
    echo ========================================
    echo  ERROR: Server exited with an error.
    echo ========================================
    pause
)
