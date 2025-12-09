# Script mejorado para verificar el estado del sistema
# Comprueba frontend, backend y procesos activos

param(
    [switch]$Detailed,
    [switch]$AutoOpen
)

Write-Host "=" * 70 -ForegroundColor Blue
Write-Host "    VERIFICACION DEL SISTEMA DE PREDICCION" -ForegroundColor Blue
Write-Host "=" * 70 -ForegroundColor Blue
Write-Host ""

$frontendUrl = 'http://localhost:3000'
$backendUrl = 'http://localhost:3001'
$backendHealthUrl = 'http://localhost:3001/health'

# Función para verificar puertos
function Test-Port {
    param($Port, $ServiceName)
    
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ Puerto $Port ($ServiceName) está abierto" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Puerto $Port ($ServiceName) no responde" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error verificando puerto $Port ($ServiceName)" -ForegroundColor Red
        return $false
    }
}

# Función para verificar HTTP
function Test-HttpEndpoint {
    param($Url, $ServiceName, $Timeout = 5)
    
    try {
        Write-Host "🔍 Verificando $ServiceName ($Url)..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec $Timeout -ErrorAction Stop
        Write-Host "✅ $ServiceName OK - Status: $($response.StatusCode)" -ForegroundColor Green
        
        if ($Detailed) {
            Write-Host "   Content-Type: $($response.Headers.'Content-Type')" -ForegroundColor Gray
            if ($response.Content.Length -lt 500) {
                Write-Host "   Content: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))" -ForegroundColor Gray
            }
        }
        return $true
    } catch {
        Write-Host "❌ $ServiceName NO disponible: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para buscar procesos Node.js
function Get-NodeProcesses {
    try {
        $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($processes) {
            Write-Host "🟢 Procesos Node.js activos:" -ForegroundColor Green
            foreach ($proc in $processes) {
                Write-Host "   PID: $($proc.Id) | Memoria: $([math]::Round($proc.WorkingSet64/1MB, 1))MB" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️  No hay procesos Node.js ejecutándose" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Error verificando procesos Node.js" -ForegroundColor Yellow
    }
}

# Verificaciones principales
Write-Host "📊 Verificando puertos..." -ForegroundColor Cyan
$frontendPortOK = Test-Port -Port 3000 -ServiceName "Frontend"
$backendPortOK = Test-Port -Port 3001 -ServiceName "Backend"

Write-Host ""
Write-Host "🌐 Verificando endpoints HTTP..." -ForegroundColor Cyan
$frontendOK = Test-HttpEndpoint -Url $frontendUrl -ServiceName "Frontend"

# Intentar diferentes URLs del backend
$backendOK = $false
if ($backendPortOK) {
    $backendOK = Test-HttpEndpoint -Url $backendHealthUrl -ServiceName "Backend Health"
    if (-not $backendOK) {
        $backendOK = Test-HttpEndpoint -Url $backendUrl -ServiceName "Backend Root"
    }
}

Write-Host ""
Get-NodeProcesses

# Resumen del estado
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Blue
Write-Host "📋 RESUMEN DEL ESTADO DEL SISTEMA" -ForegroundColor Blue
Write-Host "=" * 70 -ForegroundColor Blue

$status = @()
$status += "Frontend (Puerto 3000): $(if($frontendOK){'✅ OK'}else{'❌ ERROR'})"
$status += "Backend (Puerto 3001):  $(if($backendOK){'✅ OK'}else{'❌ ERROR'})"

foreach ($line in $status) {
    if ($line -match '✅') {
        Write-Host $line -ForegroundColor Green
    } else {
        Write-Host $line -ForegroundColor Red
    }
}

Write-Host ""
if ($frontendOK -and $backendOK) {
    Write-Host "🎉 SISTEMA COMPLETAMENTE FUNCIONAL" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Acceder al sistema:" -ForegroundColor Cyan
    Write-Host "   • Aplicación: http://localhost:3000" -ForegroundColor White
    Write-Host "   • Login:      http://localhost:3000/login" -ForegroundColor White
    Write-Host "   • API:        http://localhost:3001" -ForegroundColor White
    
    if ($AutoOpen) {
        Write-Host ""
        Write-Host "🚀 Abriendo navegador..." -ForegroundColor Yellow
        Start-Process $frontendUrl
    }
    
} elseif ($frontendOK -and -not $backendOK) {
    Write-Host "⚠️  SISTEMA PARCIALMENTE FUNCIONAL (Solo Frontend)" -ForegroundColor Yellow
    Write-Host "   El sistema funcionará en modo demo sin backend" -ForegroundColor Yellow
    Write-Host "   Acceder: http://localhost:3000" -ForegroundColor White
    
} else {
    Write-Host "❌ SISTEMA NO FUNCIONAL" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Pasos de solución:" -ForegroundColor Yellow
    Write-Host "   1. Ejecutar: .\start-all.ps1" -ForegroundColor White
    Write-Host "   2. Esperar 30-60 segundos" -ForegroundColor White
    Write-Host "   3. Ejecutar: .\start-check.ps1" -ForegroundColor White
    Write-Host "   4. Si persiste: reiniciar terminals y repetir" -ForegroundColor White
}

Write-Host ""
Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   .\start-all.ps1 -FrontendOnly  # Solo frontend" -ForegroundColor Gray
Write-Host "   .\start-all.ps1 -BackendOnly   # Solo backend" -ForegroundColor Gray
Write-Host "   .\start-check.ps1 -Detailed    # Verificación detallada" -ForegroundColor Gray
Write-Host "   .\start-check.ps1 -AutoOpen    # Abrir navegador si OK" -ForegroundColor Gray

Write-Host ""
