# ============================================================
# Sistema de Predicción de Rendimiento Académico
# Script para Detener Todos los Servicios
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🛑 DETENIENDO SISTEMA" -ForegroundColor Red
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Función para detener proceso en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    Write-Host "🔍 Buscando procesos en puerto $Port ($ServiceName)..." -ForegroundColor Yellow
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                 Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processes) {
        foreach ($proc in $processes) {
            $processInfo = Get-Process -Id $proc -ErrorAction SilentlyContinue
            if ($processInfo) {
                Write-Host "   ⚠️  Deteniendo: $($processInfo.ProcessName) (PID: $proc)" -ForegroundColor Yellow
                Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Proceso detenido" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "   ℹ️  No hay procesos en puerto $Port" -ForegroundColor Gray
    }
}

# Detener servicios
Stop-ProcessOnPort -Port 8000 -ServiceName "Microservicio IA"
Stop-ProcessOnPort -Port 4000 -ServiceName "Backend NestJS"
Stop-ProcessOnPort -Port 3000 -ServiceName "Frontend React"

# Detener procesos de node y python relacionados
Write-Host ""
Write-Host "🧹 Limpiando procesos residuales..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*sistema-prediccion-rendimiento*"
}
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Proceso Node detenido (PID: $($_.Id))" -ForegroundColor Green
    }
}

$pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*sistema-prediccion-rendimiento*"
}
if ($pythonProcesses) {
    $pythonProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Proceso Python detenido (PID: $($_.Id))" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "✅ TODOS LOS SERVICIOS DETENIDOS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para reiniciar el sistema, ejecuta: .\iniciar-sistema-completo.ps1" -ForegroundColor Cyan
Write-Host ""

# Mantener la ventana abierta
Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
