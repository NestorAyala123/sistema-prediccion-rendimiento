# Script simple y funcional para iniciar el sistema
param(
    [switch]$FrontendOnly,
    [switch]$BackendOnly
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'

Write-Host "=" * 60 -ForegroundColor Green
Write-Host "  SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = cmd /c "node --version 2>nul"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js no encontrado. Instale desde https://nodejs.org/" -ForegroundColor Red
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
$npmVersion = cmd /c "npm --version 2>nul"
if ($LASTEXITCODE -eq 0) {
    Write-Host "npm encontrado: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm no encontrado." -ForegroundColor Red
}

Write-Host ""

# Instalar dependencias del frontend si es necesario
if (-not $BackendOnly) {
    if (Test-Path $frontendPath) {
        Write-Host "Verificando dependencias del frontend..." -ForegroundColor Yellow
        if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
            Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
            Set-Location $frontendPath
            cmd /c "npm install"
            Set-Location $root
        } else {
            Write-Host "Dependencias del frontend ya instaladas" -ForegroundColor Green
        }
    }
}

# Instalar dependencias del backend si es necesario
if (-not $FrontendOnly) {
    if (Test-Path $backendPath) {
        Write-Host "Verificando dependencias del backend..." -ForegroundColor Yellow
        if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
            Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
            Set-Location $backendPath
            cmd /c "npm install"
            Set-Location $root
        } else {
            Write-Host "Dependencias del backend ya instaladas" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Cyan

# Iniciar Backend
if (-not $FrontendOnly -and (Test-Path $backendPath)) {
    Write-Host "Iniciando Backend..." -ForegroundColor Yellow
    $backendCmd = "Set-Location '$backendPath'; Write-Host 'Backend iniciado' -ForegroundColor Green; npm run start:dev"
    Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Iniciar Frontend
if (-not $BackendOnly -and (Test-Path $frontendPath)) {
    Write-Host "Iniciando Frontend..." -ForegroundColor Yellow
    $frontendCmd = "Set-Location '$frontendPath'; Write-Host 'Frontend iniciado en http://localhost:3000' -ForegroundColor Green; Start-Sleep 3; Start-Process 'http://localhost:3000'; npm start"
    Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Green
Write-Host "Sistema iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales demo:" -ForegroundColor Cyan  
Write-Host "  Email: admin@universidad.edu" -ForegroundColor White
Write-Host "  Password: 123456" -ForegroundColor White
Write-Host "=" * 60 -ForegroundColor Green

# Abrir navegador después de un momento
if (-not $BackendOnly) {
    Write-Host ""
    $openBrowser = Read-Host "Abrir navegador? (Y/n)"
    if ($openBrowser -eq "" -or $openBrowser.ToLower() -eq "y") {
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3000"
    }
}