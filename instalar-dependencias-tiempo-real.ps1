# ============================================================
# Instalar Dependencias de Tiempo Real
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "INSTALANDO DEPENDENCIAS PARA TIEMPO REAL" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Instalar dependencias del backend
Write-Host "📦 Instalando Socket.IO en backend..." -ForegroundColor Yellow
Set-Location backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

Write-Host ""
Write-Host "✅ Dependencias del backend instaladas" -ForegroundColor Green
Write-Host ""

# Volver al directorio raíz
Set-Location ..

# Instalar dependencias del frontend
Write-Host "📦 Instalando Socket.IO Client en frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install socket.io-client

Write-Host ""
Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
Write-Host ""

# Volver al directorio raíz
Set-Location ..

Write-Host "============================================================" -ForegroundColor Green
Write-Host "INSTALACION COMPLETADA" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar el sistema con: .\iniciar-sistema-completo.ps1" -ForegroundColor White
Write-Host ""
