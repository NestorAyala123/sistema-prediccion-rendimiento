# ========================================
# SCRIPT DE INICIO COMPLETO DEL SISTEMA
# Backend (NestJS) + Frontend (React)
# ========================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SISTEMA DE PREDICCIÓN ACADÉMICA" -ForegroundColor Cyan
Write-Host "   Iniciando Backend + Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta raíz del proyecto
$rootPath = $PSScriptRoot

# Función para verificar Node.js
function Test-NodeInstalled {
    Write-Host "⏳ Verificando Node.js..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Node.js NO está instalado" -ForegroundColor Red
        Write-Host "   Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
        return $false
    }
}

# Función para detener procesos previos
function Stop-PreviousProcesses {
    Write-Host ""
    Write-Host "⏳ Deteniendo procesos previos..." -ForegroundColor Yellow
    
    try {
        # Detener procesos de Node.js en puertos 3000 y 4000
        Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✅ Procesos anteriores detenidos" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No hay procesos previos que detener" -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 2
}

# Función para verificar dependencias
function Test-Dependencies {
    param($path, $name)
    
    if (Test-Path "$path\node_modules") {
        Write-Host "✅ Dependencias de $name encontradas" -ForegroundColor Green
        return $true
    } else {
        Write-Host "⚠️  Dependencias de $name no encontradas" -ForegroundColor Yellow
        return $false
    }
}

# Función para instalar dependencias
function Install-Dependencies {
    param($path, $name)
    
    Write-Host ""
    Write-Host "📦 Instalando dependencias de $name..." -ForegroundColor Yellow
    Push-Location $path
    
    try {
        npm install --legacy-peer-deps
        Write-Host "✅ Dependencias de $name instaladas" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error instalando dependencias de $name" -ForegroundColor Red
        Pop-Location
        return $false
    }
    
    Pop-Location
    return $true
}

# Función para verificar la base de datos SQLite
function Test-Database {
    Write-Host ""
    Write-Host "⏳ Verificando base de datos..." -ForegroundColor Yellow
    
    $dbPath = Join-Path $rootPath "backend\database"
    
    # Crear directorio si no existe
    if (-not (Test-Path $dbPath)) {
        New-Item -ItemType Directory -Path $dbPath -Force | Out-Null
        Write-Host "✅ Directorio de base de datos creado" -ForegroundColor Green
    } else {
        Write-Host "✅ Directorio de base de datos encontrado" -ForegroundColor Green
    }
    
    # Verificar si existe el archivo de base de datos
    $dbFile = Join-Path $dbPath "academic_prediction.db"
    if (Test-Path $dbFile) {
        Write-Host "✅ Base de datos SQLite encontrada" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Base de datos se creará al iniciar el backend" -ForegroundColor Cyan
    }
    
    return $true
}

# ========================================
# PROCESO PRINCIPAL
# ========================================

Write-Host "PASO 1: Verificación de requisitos" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan

if (-not (Test-NodeInstalled)) {
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "PASO 2: Limpieza de procesos" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
Stop-PreviousProcesses

Write-Host ""
Write-Host "PASO 3: Verificación de base de datos" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
Test-Database | Out-Null

Write-Host ""
Write-Host "PASO 4: Verificación de dependencias" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan

# Verificar Backend
$backendPath = Join-Path $rootPath "backend"
if (-not (Test-Dependencies $backendPath "Backend")) {
    if (-not (Install-Dependencies $backendPath "Backend")) {
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Verificar Frontend
$frontendPath = Join-Path $rootPath "frontend"
if (-not (Test-Dependencies $frontendPath "Frontend")) {
    if (-not (Install-Dependencies $frontendPath "Frontend")) {
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host ""
Write-Host "PASO 5: Iniciando servicios" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan

# Iniciar Backend en una nueva ventana de PowerShell
Write-Host "🚀 Iniciando Backend (NestJS)..." -ForegroundColor Yellow
$backendScript = @"
Set-Location '$backendPath'
Write-Host '========================================' -ForegroundColor Green
Write-Host '         BACKEND - NestJS' -ForegroundColor Green
Write-Host '    http://localhost:4000' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
npm run start:dev
Read-Host 'Presiona Enter para cerrar'
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

Write-Host "✅ Backend iniciado en nueva ventana" -ForegroundColor Green
Write-Host "   URL: http://localhost:4000" -ForegroundColor White

# Esperar 5 segundos para que el backend inicie
Write-Host ""
Write-Host "⏳ Esperando 5 segundos para que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar Frontend en una nueva ventana de PowerShell
Write-Host ""
Write-Host "🚀 Iniciando Frontend (React)..." -ForegroundColor Yellow
$frontendScript = @"
Set-Location '$frontendPath'
Write-Host '========================================' -ForegroundColor Blue
Write-Host '         FRONTEND - React' -ForegroundColor Blue
Write-Host '    http://localhost:3000' -ForegroundColor Blue
Write-Host '========================================' -ForegroundColor Blue
Write-Host ''
npm start
Read-Host 'Presiona Enter para cerrar'
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host "✅ Frontend iniciado en nueva ventana" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000" -ForegroundColor White

# Esperar y abrir navegador
Write-Host ""
Write-Host "⏳ Abriendo navegador en 8 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ SISTEMA INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "📝 Información importante:" -ForegroundColor Cyan
Write-Host "   - Los datos se guardan en SQLite (backend/database/)" -ForegroundColor White
Write-Host "   - Backend y Frontend en ventanas separadas" -ForegroundColor White
Write-Host "   - Cierra las ventanas para detener los servicios" -ForegroundColor White
Write-Host ""
Write-Host "Para detener: Cierra las ventanas de Backend y Frontend" -ForegroundColor Yellow
Write-Host ""

Read-Host "Presiona Enter para cerrar esta ventana"
