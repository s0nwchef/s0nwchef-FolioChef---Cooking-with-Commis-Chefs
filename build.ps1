# FolioChef Build Script
$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Green
Write-Host "  FolioChef Build Script" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/4] Installing client dependencies..." -ForegroundColor Yellow
Push-Location client
npm install
Pop-Location
Write-Host ""

Write-Host "[2/4] Building client..." -ForegroundColor Yellow
Push-Location client
npm run build
Pop-Location
Write-Host ""

Write-Host "[3/4] Installing root dependencies..." -ForegroundColor Yellow
npm install
Write-Host ""

Write-Host "[4/4] Building Electron app (Windows portable)..." -ForegroundColor Yellow
npx electron-builder --win portable --publish never

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Build complete! Check the 'release' folder" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
