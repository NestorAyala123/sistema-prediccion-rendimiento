# Sistema de Predicción Académica - Script de Inicio Optimizado
# Versión 2.0 - Diciembre 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Predicción Académica" -ForegroundColor Cyan
Write-Host "  Iniciando aplicación..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$ErrorActionPreference = "Continue"
$projectRoot = $PSScriptRoot
$frontendPath = Join-Path $projectRoot "frontend"

# Función para verificar Node.js
function Test-NodeInstalled {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "[OK] Node.js instalado: $nodeVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "[ERROR] Node.js no está instalado" -ForegroundColor Red
        Write-Host "Por favor, instale Node.js desde https://nodejs.org/" -ForegroundColor Yellow
        return $false
    }
    return $false
}

# Función para limpiar procesos anteriores
function Stop-PreviousProcesses {
    Write-Host ""
    Write-Host "Deteniendo procesos anteriores..." -ForegroundColor Yellow
    
    try {
        Get-Process | Where-Object { $_.ProcessName -match "node" } | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        Write-Host "[OK] Procesos anteriores detenidos" -ForegroundColor Green
    } catch {
        Write-Host "[AVISO] No hay procesos anteriores para detener" -ForegroundColor Yellow
    }
}

# Función para verificar dependencias
function Test-Dependencies {
    param([string]$Path)
    
    $nodeModulesPath = Join-Path $Path "node_modules"
    
    if (Test-Path $nodeModulesPath) {
        Write-Host "[OK] Dependencias instaladas" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[AVISO] Dependencias no encontradas, instalando..." -ForegroundColor Yellow
        return $false
    }
}

# Función para instalar dependencias
function Install-Dependencies {
    param([string]$Path)
    
    Write-Host ""
    Write-Host "Instalando dependencias en: $Path" -ForegroundColor Cyan
    
    Push-Location $Path
    try {
        npm install --legacy-peer-deps
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Dependencias instaladas correctamente" -ForegroundColor Green
            Pop-Location
            return $true
        } else {
            Write-Host "[ERROR] Error al instalar dependencias" -ForegroundColor Red
            Pop-Location
            return $false
        }
    } catch {
        Write-Host "[ERROR] Error al instalar dependencias: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Función para limpiar localStorage
function Clear-BrowserCache {
    Write-Host ""
    Write-Host "NOTA: Si tienes problemas, limpia el localStorage del navegador:" -ForegroundColor Yellow
    Write-Host "  1. Abre DevTools (F12)" -ForegroundColor Yellow
    Write-Host "  2. Ve a Application > Local Storage" -ForegroundColor Yellow
    Write-Host "  3. Elimina todos los items o ejecuta: localStorage.clear()" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar Node.js
if (-not (Test-NodeInstalled)) {
    Write-Host ""
    Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Detener procesos anteriores
Stop-PreviousProcesses

# Verificar e instalar dependencias del frontend
Write-Host ""
Write-Host "Verificando frontend..." -ForegroundColor Cyan

if (-not (Test-Path $frontendPath)) {
    Write-Host "[ERROR] Carpeta frontend no encontrada en: $frontendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Dependencies -Path $frontendPath)) {
    if (-not (Install-Dependencies -Path $frontendPath)) {
        Write-Host ""
        Write-Host "No se pudieron instalar las dependencias. Saliendo..." -ForegroundColor Red
        Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# Iniciar frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Iniciando Frontend..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "El navegador se abrirá automáticamente en:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de demo:" -ForegroundColor Yellow
Write-Host "  Email: cualquier@email.com" -ForegroundColor Yellow
Write-Host "  Password: cualquier contraseña" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para detener el servidor, presione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

Clear-BrowserCache

# Cambiar a directorio frontend e iniciar
Push-Location $frontendPath
try {
    # Usar npm start directamente
    npm start
} catch {
    Write-Host ""
    Write-Host "[ERROR] Error al iniciar el frontend: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "Sistema detenido." -ForegroundColor Yellow
Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
