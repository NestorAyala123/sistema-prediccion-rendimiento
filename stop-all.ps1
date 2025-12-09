# Script para detener todos los procesos del sistema
# Mata procesos Node.js y libera puertos

param(
    [switch]$Force,
    [switch]$Confirm = $true
)

Write-Host "=" * 60 -ForegroundColor Red
Write-Host "    DETENCION DEL SISTEMA DE PREDICCION" -ForegroundColor Red
Write-Host "=" * 60 -ForegroundColor Red
Write-Host ""

# Función para matar procesos por puerto
function Stop-ProcessByPort {
    param($Port, $ServiceName)
    
    try {
        $processInfo = netstat -ano | Select-String ":$Port "
        if ($processInfo) {
            $processInfo | ForEach-Object {
                $line = $_.Line.Trim()
                $parts = $line -split '\s+'
                if ($parts.Length -ge 5) {
                    $pid = $parts[4]
                    try {
                        $process = Get-Process -Id $pid -ErrorAction Stop
                        Write-Host "🔍 Encontrado $ServiceName en puerto $Port (PID: $pid, Proceso: $($process.ProcessName))" -ForegroundColor Yellow
                        
                        if (-not $Confirm -or $Force) {
                            Stop-Process -Id $pid -Force
                            Write-Host "✅ Proceso $pid terminado" -ForegroundColor Green
                        } else {
                            $response = Read-Host "¿Terminar proceso $pid ($($process.ProcessName))? (Y/n)"
                            if ($response -eq "" -or $response.ToLower() -eq "y") {
                                Stop-Process -Id $pid -Force
                                Write-Host "✅ Proceso $pid terminado" -ForegroundColor Green
                            } else {
                                Write-Host "⏭️  Proceso $pid omitido" -ForegroundColor Yellow
                            }
                        }
                    } catch {
                        Write-Host "⚠️  No se pudo obtener información del proceso $pid" -ForegroundColor Yellow
                    }
                }
            }
        } else {
            Write-Host "ℹ️  No hay procesos usando puerto $Port" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Error verificando puerto $Port : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Función para matar todos los procesos Node.js
function Stop-AllNodeProcesses {
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            Write-Host "🔍 Encontrados $($nodeProcesses.Count) procesos Node.js" -ForegroundColor Yellow
            
            foreach ($process in $nodeProcesses) {
                Write-Host "   PID: $($process.Id) | Memoria: $([math]::Round($process.WorkingSet64/1MB, 1))MB" -ForegroundColor Gray
                
                if (-not $Confirm -or $Force) {
                    Stop-Process -Id $process.Id -Force
                    Write-Host "✅ Proceso Node.js $($process.Id) terminado" -ForegroundColor Green
                } else {
                    $response = Read-Host "¿Terminar proceso Node.js $($process.Id)? (Y/n)"
                    if ($response -eq "" -or $response.ToLower() -eq "y") {
                        Stop-Process -Id $process.Id -Force
                        Write-Host "✅ Proceso Node.js $($process.Id) terminado" -ForegroundColor Green
                    }
                }
            }
        } else {
            Write-Host "ℹ️  No hay procesos Node.js ejecutándose" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Error terminando procesos Node.js: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Mostrar procesos actuales
Write-Host "📊 Verificando procesos actuales..." -ForegroundColor Cyan
Write-Host ""

# Verificar puertos específicos
Write-Host "🔍 Verificando puertos del sistema..." -ForegroundColor Yellow
Stop-ProcessByPort -Port 3000 -ServiceName "Frontend"
Stop-ProcessByPort -Port 3001 -ServiceName "Backend"

Write-Host ""
Write-Host "🔍 Verificando todos los procesos Node.js..." -ForegroundColor Yellow
Stop-AllNodeProcesses

# Verificación final
Write-Host ""
Write-Host "🔍 Verificación final..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

$finalCheck = @()
try {
    $port3000 = Test-NetConnection -ComputerName "localhost" -Port 3000 -WarningAction SilentlyContinue
    $finalCheck += "Puerto 3000: $(if($port3000.TcpTestSucceeded){'⚠️ AÚN ACTIVO'}else{'✅ LIBERADO'})"
} catch {
    $finalCheck += "Puerto 3000: ✅ LIBERADO"
}

try {
    $port3001 = Test-NetConnection -ComputerName "localhost" -Port 3001 -WarningAction SilentlyContinue  
    $finalCheck += "Puerto 3001: $(if($port3001.TcpTestSucceeded){'⚠️ AÚN ACTIVO'}else{'✅ LIBERADO'})"
} catch {
    $finalCheck += "Puerto 3001: ✅ LIBERADO"
}

$remainingNode = Get-Process -Name "node" -ErrorAction SilentlyContinue
$finalCheck += "Procesos Node.js: $(if($remainingNode){"⚠️ $($remainingNode.Count) AÚN ACTIVOS"}else{'✅ TODOS TERMINADOS'})"

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Blue
Write-Host "📋 ESTADO FINAL" -ForegroundColor Blue
Write-Host "=" * 60 -ForegroundColor Blue

foreach ($check in $finalCheck) {
    if ($check -match '✅') {
        Write-Host $check -ForegroundColor Green
    } else {
        Write-Host $check -ForegroundColor Yellow
    }
}

Write-Host ""
if ($remainingNode -or $port3000.TcpTestSucceeded -or $port3001.TcpTestSucceeded) {
    Write-Host "⚠️  Algunos procesos aún están activos" -ForegroundColor Yellow
    Write-Host "💡 Si necesita forzar la terminación, use: .\stop-all.ps1 -Force" -ForegroundColor Cyan
} else {
    Write-Host "🎉 TODOS LOS PROCESOS TERMINADOS CORRECTAMENTE" -ForegroundColor Green
    Write-Host "✅ Puertos liberados - Sistema listo para reiniciar" -ForegroundColor Green
}

Write-Host ""