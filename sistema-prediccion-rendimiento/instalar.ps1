# Script de instalación y arranque - PowerShell
# Sistema de Predicción de Rendimiento Académico
# v2.0 - Optimizado con mejor gestión de procesos

function Show-Menu {
    Clear-Host
    Write-Host "╔═════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  SISTEMA DE PREDICCIÓN DE RENDIMIENTO ACADÉMICO ║" -ForegroundColor Cyan
    Write-Host "║          Guía de Instalación y Arranque         ║" -ForegroundColor Cyan
    Write-Host "╚═════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "  1 - Instalar dependencias (backend + frontend)" -ForegroundColor White
    Write-Host "  2 - Arrancar backend (puerto 3001)" -ForegroundColor White
    Write-Host "  3 - Arrancar frontend (puerto 3000)" -ForegroundColor White
    Write-Host "  4 - Arrancar ambos en paralelo ⚡ RECOMENDADO" -ForegroundColor Cyan
    Write-Host "  5 - Limpiar y reinstalar todo" -ForegroundColor White
    Write-Host "  6 - Verificar estado del sistema" -ForegroundColor White
    Write-Host "  7 - Salir" -ForegroundColor White
    Write-Host ""
}

function Install-Dependencies {
    Write-Host "[*] Instalando dependencias del backend..." -ForegroundColor Green
    Set-Location "backend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Falló la instalación del backend" -ForegroundColor Red
        Set-Location ".."
        return
    }
    Set-Location ".."
    
    Write-Host "[*] Instalando dependencias del frontend..." -ForegroundColor Green
    Set-Location "frontend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Falló la instalación del frontend" -ForegroundColor Red
        Set-Location ".."
        return
    }
    Set-Location ".."
    
    Write-Host "[OK] ✓ Todas las dependencias instaladas correctamente" -ForegroundColor Green
}

function Start-Backend {
    Write-Host "[*] Arrancando backend en puerto 3001..." -ForegroundColor Green
    Set-Location "backend"
    npm run start:dev
}

function Start-Frontend {
    Write-Host "[*] Arrancando frontend en puerto 3000..." -ForegroundColor Green
    Set-Location "frontend"
    npm start
}

function Start-Both {
    Write-Host "[*] Iniciando ambos servicios..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Se abrirán dos ventanas PowerShell:" -ForegroundColor Yellow
    Write-Host "  ① Backend (puerto 3001)" -ForegroundColor White
    Write-Host "  ② Frontend (puerto 3000)" -ForegroundColor White
    Write-Host ""
    
    # Obtener ruta actual
    $rootPath = Get-Location
    
    # Abrir backend en nueva ventana
    Write-Host "[*] Abriendo backend..." -ForegroundColor Green
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$rootPath\backend'; Write-Host 'Backend iniciándose...' -ForegroundColor Cyan; npm run start:dev" `
        -WindowStyle Normal
    
    Start-Sleep -Seconds 4
    
    # Abrir frontend en nueva ventana
    Write-Host "[*] Abriendo frontend..." -ForegroundColor Green
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; Write-Host 'Frontend iniciándose...' -ForegroundColor Cyan; npm start" `
        -WindowStyle Normal
    
    Write-Host ""
    Write-Host "[OK] ✓ Ambas terminales se han abierto correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Espera a que ambos procesos estén listos:" -ForegroundColor Yellow
    Write-Host "  ✓ Backend: Presiona Ctrl+C para detener" -ForegroundColor White
    Write-Host "  ✓ Frontend: Presiona Ctrl+C para detener" -ForegroundColor White
    Write-Host ""
    Write-Host "Una vez listo:" -ForegroundColor Cyan
    Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  • API Backend: http://localhost:3001" -ForegroundColor White
}

function Invoke-CleanReinstall {
    Write-Host "[*] Limpiando y reinstalando todo..." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "[*] Backend..." -ForegroundColor Green
    Set-Location "backend"
    if (Test-Path "node_modules") {
        Write-Host "  Eliminando node_modules..." -ForegroundColor Gray
        Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue | Out-Null
    }
    Write-Host "  Instalando paquetes..." -ForegroundColor Gray
    npm install
    Set-Location ".."
    
    Write-Host ""
    Write-Host "[*] Frontend..." -ForegroundColor Green
    Set-Location "frontend"
    if (Test-Path "node_modules") {
        Write-Host "  Eliminando node_modules..." -ForegroundColor Gray
        Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue | Out-Null
    }
    Write-Host "  Instalando paquetes..." -ForegroundColor Gray
    npm install
    Set-Location ".."
    
    Write-Host ""
    Write-Host "[OK] ✓ Limpieza y reinstalación completadas" -ForegroundColor Green
}

# Verificar que Node.js esté instalado
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "❌ ERROR: Node.js no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Descárgalo en: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Se recomienda la versión LTS (Long Term Support)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host "✓ Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

function Show-SystemStatus {
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "ESTADO DEL SISTEMA" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Node.js:         " -NoNewline -ForegroundColor White
    Write-Host "$nodeVersion" -ForegroundColor Green
    
    Write-Host "NPM:             " -NoNewline -ForegroundColor White
    $npmVersion = npm --version 2>$null
    Write-Host "$npmVersion" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Dependencias instaladas:" -ForegroundColor Yellow
    
    $backendReady = Test-Path "backend/node_modules"
    $frontendReady = Test-Path "frontend/node_modules"
    
    Write-Host "  Backend:       " -NoNewline -ForegroundColor White
    if ($backendReady) { Write-Host "✓ Listo" -ForegroundColor Green }
    else { Write-Host "✗ No instalado" -ForegroundColor Red }
    
    Write-Host "  Frontend:      " -NoNewline -ForegroundColor White
    if ($frontendReady) { Write-Host "✓ Listo" -ForegroundColor Green }
    else { Write-Host "✗ No instalado" -ForegroundColor Red }
    
    Write-Host ""
    Write-Host "Puertos:" -ForegroundColor Yellow
    
    $backendPort = Test-NetConnection -ComputerName 127.0.0.1 -Port 3001 -InformationLevel Quiet -ErrorAction SilentlyContinue
    $frontendPort = Test-NetConnection -ComputerName 127.0.0.1 -Port 3000 -InformationLevel Quiet -ErrorAction SilentlyContinue
    
    Write-Host "  Backend (3001):  " -NoNewline -ForegroundColor White
    if ($backendPort) { Write-Host "Ocupado" -ForegroundColor Yellow }
    else { Write-Host "Disponible" -ForegroundColor Green }
    
    Write-Host "  Frontend (3000): " -NoNewline -ForegroundColor White
    if ($frontendPort) { Write-Host "Ocupado" -ForegroundColor Yellow }
    else { Write-Host "Disponible" -ForegroundColor Green }
    
    Write-Host ""
}

# Loop principal del menú
do {
    Show-Menu
    $choice = Read-Host "Ingresa el número"
    
    switch ($choice) {
        "1" { 
            Install-Dependencies
            Read-Host ""
            Read-Host "Presiona ENTER para continuar..."
        }
        "2" { 
            Start-Backend
            break 
        }
        "3" { 
            Start-Frontend
            break 
        }
        "4" { 
            Start-Both
            break
        }
        "5" { 
            Invoke-CleanReinstall
            Read-Host ""
            Read-Host "Presiona ENTER para continuar..."
        }
        "6" {
            Show-SystemStatus
            Read-Host ""
            Read-Host "Presiona ENTER para continuar..."
        }
        "7" { 
            Write-Host ""
            Write-Host "👋 Hasta luego!" -ForegroundColor Yellow
            exit 0
        }
        default { 
            Write-Host ""
            Write-Host "❌ Opción inválida. Presiona ENTER para continuar..." -ForegroundColor Red
            Read-Host
        }
    }
} while ($true)
