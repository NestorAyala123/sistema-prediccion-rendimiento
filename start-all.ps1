# Script mejorado para iniciar backend y frontend
# Verifica dependencias y maneja errores
# Uso: Ejecutar desde la raíz del proyecto

param(
    [switch]$FrontendOnly,
    [switch]$BackendOnly,
    [switch]$SkipInstall
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'

Write-Host "=" * 70 -ForegroundColor Green
Write-Host "    SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""

# Función para verificar si Node.js está instalado
function Test-NodeJs {
    try {
        $nodeVersion = cmd /c "node --version 2>&1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ Node.js no encontrado" -ForegroundColor Red
        return $false
    }
    return $false
}

# Función para verificar npm
function Test-Npm {
    try {
        $npmVersion = cmd /c "npm --version 2>&1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ npm no encontrado" -ForegroundColor Red
        return $false
    }
    return $false
}

# Verificar requisitos
if (-not (Test-NodeJs) -or -not (Test-Npm)) {
    Write-Host ""
    Write-Host "⚠️  Instale Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "⚠️  Reinicie PowerShell después de la instalación" -ForegroundColor Yellow
    Read-Host "Presione Enter para continuar de todas formas o Ctrl+C para salir"
}

Write-Host ""

# Función para instalar dependencias
function Install-Dependencies {
    param($Path, $Name)
    
    if (-not $SkipInstall -and -not (Test-Path (Join-Path $Path "node_modules"))) {
        Write-Host "📦 Instalando dependencias de $Name..." -ForegroundColor Yellow
        Push-Location $Path
        try {
            cmd /c "npm install --silent"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Dependencias de $Name instaladas" -ForegroundColor Green
            } else {
                Write-Host "❌ Error instalando dependencias de $Name" -ForegroundColor Red
                return $false
            }
        } catch {
            Write-Host "❌ Error instalando dependencias de $Name" -ForegroundColor Red
            return $false
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "✅ Dependencias de $Name ya instaladas" -ForegroundColor Green
    }
    return $true
}
}

# Instalar dependencias según opciones
if (-not $FrontendOnly) {
    if (Test-Path $backendPath) {
        Install-Dependencies $backendPath "Backend"
    } else {
        Write-Host "⚠️  Directorio backend no encontrado: $backendPath" -ForegroundColor Yellow
    }
}

if (-not $BackendOnly) {
    if (Test-Path $frontendPath) {
        Install-Dependencies $frontendPath "Frontend"
    } else {
        Write-Host "❌ Directorio frontend no encontrado: $frontendPath" -ForegroundColor Red
        Read-Host "Presione Enter para salir"
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Cyan

# Iniciar Backend
if (-not $FrontendOnly -and (Test-Path $backendPath)) {
    Write-Host "🔧 Iniciando Backend en puerto 3001..." -ForegroundColor Yellow
    try {
        $backendCmd = "Set-Location '$backendPath'; Write-Host 'Backend iniciado en $backendPath' -ForegroundColor Green; cmd /c 'npm run start:dev'"
        Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal
        Write-Host "✅ Backend lanzado en nueva ventana" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al iniciar Backend: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}

# Iniciar Frontend
if (-not $BackendOnly -and (Test-Path $frontendPath)) {
    Write-Host "🎨 Iniciando Frontend en puerto 3000..." -ForegroundColor Yellow
    try {
        $frontendCmd = "Set-Location '$frontendPath'; Write-Host 'Frontend iniciado en $frontendPath' -ForegroundColor Green; Write-Host 'Abriendo http://localhost:3000...' -ForegroundColor Cyan; Start-Sleep 3; Start-Process 'http://localhost:3000'; cmd /c 'npm start'"
        Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal
        Write-Host "✅ Frontend lanzado en nueva ventana" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al iniciar Frontend: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "🎉 Sistema iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs del sistema:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Credenciales de demo:" -ForegroundColor Cyan  
Write-Host "   • Email:    cualquier@email.com" -ForegroundColor White
Write-Host "   • Password: cualquier_password" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Las ventanas de los servicios se abrieron por separado" -ForegroundColor Yellow
Write-Host "   Use start-check.ps1 para verificar el estado" -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Green

# Opcional: Abrir el navegador después de un momento
if (-not $BackendOnly) {
    Write-Host ""
    $openBrowser = Read-Host "¿Abrir el navegador ahora? (Y/n)"
    if ($openBrowser -eq "" -or $openBrowser.ToLower() -eq "y") {
        Start-Sleep -Seconds 3
        Start-Process "http://localhost:3000"
    }
}
