# Script para iniciar el frontend del Sistema de Predicción de Rendimiento Académico
Write-Host "Iniciando Sistema de Prediccion de Rendimiento Academico - Frontend" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green

$originalLocation = Get-Location
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

try {
    Set-Location $scriptPath
    Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""

    # Verificar Node.js
    Write-Host "Verificando Node.js..." -ForegroundColor Cyan
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }

    # Verificar npm usando cmd
    Write-Host ""
    Write-Host "Verificando npm..." -ForegroundColor Cyan
    try {
        $npmVersion = cmd /c "npm --version 2>&1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "npm version: $npmVersion" -ForegroundColor Green
        } else {
            throw "npm command failed"
        }
    } catch {
        Write-Host "Error: npm no está disponible" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }

    # Verificar dependencias
    Write-Host ""
    if (!(Test-Path "node_modules")) {
        Write-Host "Instalando dependencias por primera vez..." -ForegroundColor Yellow
        cmd /c "npm install"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error al instalar dependencias" -ForegroundColor Red
            Read-Host "Presiona Enter para salir"
            exit 1
        }
    } else {
        Write-Host "Dependencias ya instaladas." -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "Iniciando el servidor de desarrollo en http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""

    # Iniciar el servidor
    cmd /c "npm start"

} catch {
    Write-Host "Error inesperado: $_" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
} finally {
    Set-Location $originalLocation
}