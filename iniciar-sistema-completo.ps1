# ============================================================
# Sistema de Predicción de Rendimiento Académico
# Script de Inicio Completo
# ============================================================
# Este script inicia todos los servicios necesarios:
# - Backend (NestJS) en puerto 4000
# - Frontend (React) en puerto 3000
# - Microservicio IA (FastAPI) en puerto 8000
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Verificar puertos
Write-Host "Verificando puertos disponibles..." -ForegroundColor Yellow
$ports = @{
    "Backend" = 4000
    "Frontend" = 3000
    "IA" = 8000
}

foreach ($service in $ports.Keys) {
    $port = $ports[$service]
    if (Test-Port -Port $port) {
        Write-Host "   Puerto $port ($service) ya esta en uso" -ForegroundColor Red
        $response = Read-Host "   Deseas detener el proceso existente? (s/n)"
        if ($response -eq 's') {
            $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($proc in $processes) {
                Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
                Write-Host "   Proceso detenido" -ForegroundColor Green
            }
        }
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Iniciando servicios..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Habilitar ejecución de scripts para este proceso
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# Verificar si existe el entorno virtual de Python
$venvPath = ".\.venv\Scripts\python.exe"
if (-Not (Test-Path $venvPath)) {
    Write-Host "No se encontro el entorno virtual de Python" -ForegroundColor Red
    Write-Host "   Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "   Instalando dependencias de Python..." -ForegroundColor Yellow
    & $venvPath -m pip install fastapi uvicorn pydantic
}

# 1. Iniciar Microservicio de IA (Python/FastAPI)
Write-Host "Iniciando Microservicio de IA (Python/FastAPI)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& `"$venvPath`" predictor_api.py" -WindowStyle Normal
Start-Sleep -Seconds 3

# 2. Iniciar Backend (NestJS)
Write-Host "Iniciando Backend (NestJS)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; cd backend; npm start" -WindowStyle Normal
Start-Sleep -Seconds 5

# 3. Iniciar Frontend (React)
Write-Host "Iniciando Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; cd frontend; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "SERVICIOS EN PROCESO DE INICIO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Yellow
Write-Host "   Frontend (React):     http://localhost:3000" -ForegroundColor White
Write-Host "   Backend (NestJS):     http://localhost:4000" -ForegroundColor White
Write-Host "   IA (FastAPI):         http://localhost:8000" -ForegroundColor White
Write-Host "   Docs IA:              http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Espera 10-15 segundos para que todos los servicios esten listos" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para detener todos los servicios:" -ForegroundColor Red
Write-Host "   Ejecuta: .\detener-sistema.ps1" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Sistema listo para usar" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

# Mantener la ventana abierta
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
