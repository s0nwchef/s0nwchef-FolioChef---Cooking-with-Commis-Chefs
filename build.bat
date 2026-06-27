@echo off
echo ============================================
echo   FolioChef Build Script
echo ============================================
echo.

echo [1/4] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    exit /b 1
)
echo.

echo [2/4] Building client...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build client
    exit /b 1
)
echo.

echo [3/4] Installing root dependencies...
cd ..
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    exit /b 1
)
echo.

echo [4/4] Building Electron app...
call npx electron-builder --win --publish never
if errorlevel 1 (
    echo ERROR: Failed to build Electron app
    exit /b 1
)

echo.
echo ============================================
echo   Build complete! Check the 'release' folder
echo ============================================
