# Script de diagnóstico completo del sistema
# Identifica y soluciona problemas comunes

param(
    [switch]$AutoFix,
    [switch]$Verbose
)

Write-Host "=" * 70 -ForegroundColor Magenta
Write-Host "    DIAGNOSTICO DEL SISTEMA DE PREDICCION" -ForegroundColor Magenta  
Write-Host "=" * 70 -ForegroundColor Magenta
Write-Host ""

$issues = @()
$fixes = @()

# 1. Verificar Node.js y npm
Write-Host "🔍 1. Verificando Node.js y npm..." -ForegroundColor Yellow

try {
    $nodeVersion = cmd /c "node --version 2>&1"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
        
        # Verificar versión mínima
        if ($nodeVersion -match "v(\d+)\.") {
            $majorVersion = [int]$Matches[1]
            if ($majorVersion -lt 16) {
                $issues += "Node.js versión muy antigua ($nodeVersion). Se requiere v16+"
                $fixes += "Actualizar Node.js desde https://nodejs.org/"
            }
        }
    } else {
        $issues += "Node.js no está instalado o no está en PATH"
        $fixes += "Instalar Node.js desde https://nodejs.org/"
    }
} catch {
    $issues += "Error verificando Node.js"
    $fixes += "Reinstalar Node.js"
}

try {
    $npmVersion = cmd /c "npm --version 2>&1"  
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ npm: v$npmVersion" -ForegroundColor Green
    } else {
        $issues += "npm no está disponible"
        $fixes += "Reinstalar Node.js (incluye npm)"
    }
} catch {
    $issues += "Error verificando npm"
}

# 2. Verificar estructura de directorios
Write-Host ""
Write-Host "🔍 2. Verificando estructura del proyecto..." -ForegroundColor Yellow

$requiredDirs = @("frontend", "backend")
$requiredFiles = @("start-all.ps1", "start-check.ps1", "frontend\package.json")

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "   ✅ Directorio: $dir" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Directorio faltante: $dir" -ForegroundColor Red
        $issues += "Directorio faltante: $dir"
        $fixes += "Verificar que esté en el directorio raíz del proyecto"
    }
}

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ Archivo: $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Archivo faltante: $file" -ForegroundColor Red
        $issues += "Archivo faltante: $file"
    }
}

# 3. Verificar dependencias
Write-Host ""
Write-Host "🔍 3. Verificando dependencias..." -ForegroundColor Yellow

if (Test-Path "frontend\package.json") {
    if (Test-Path "frontend\node_modules") {
        $nodeModulesCount = (Get-ChildItem "frontend\node_modules" | Measure-Object).Count
        Write-Host "   ✅ Frontend node_modules ($nodeModulesCount paquetes)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend node_modules faltante" -ForegroundColor Red
        $issues += "Dependencias del frontend no instaladas"
        $fixes += "Ejecutar: cd frontend && npm install"
    }
}

if (Test-Path "backend\package.json") {
    if (Test-Path "backend\node_modules") {
        Write-Host "   ✅ Backend node_modules instaladas" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend node_modules faltante" -ForegroundColor Red
        $issues += "Dependencias del backend no instaladas" 
        $fixes += "Ejecutar: cd backend && npm install"
    }
}

# 4. Verificar puertos
Write-Host ""
Write-Host "🔍 4. Verificando disponibilidad de puertos..." -ForegroundColor Yellow

$ports = @(3000, 3001)
foreach ($port in $ports) {
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "   ⚠️  Puerto $port está ocupado" -ForegroundColor Yellow
            
            # Intentar identificar el proceso
            $processInfo = netstat -ano | Select-String ":$port "
            if ($processInfo) {
                $processInfo | ForEach-Object {
                    $line = $_.Line.Trim()
                    $parts = $line -split '\s+'
                    if ($parts.Length -ge 5) {
                        $pid = $parts[4]
                        try {
                            $process = Get-Process -Id $pid -ErrorAction Stop
                            Write-Host "      Proceso: $($process.ProcessName) (PID: $pid)" -ForegroundColor Gray
                        } catch {
                            Write-Host "      PID: $pid (proceso no identificado)" -ForegroundColor Gray
                        }
                    }
                }
            }
        } else {
            Write-Host "   ✅ Puerto $port disponible" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ✅ Puerto $port disponible" -ForegroundColor Green
    }
}

# 5. Verificar PowerShell ExecutionPolicy  
Write-Host ""
Write-Host "🔍 5. Verificando PowerShell ExecutionPolicy..." -ForegroundColor Yellow

try {
    $policy = Get-ExecutionPolicy -Scope CurrentUser
    Write-Host "   Política actual: $policy" -ForegroundColor Gray
    
    if ($policy -eq "Restricted") {
        Write-Host "   ❌ ExecutionPolicy muy restrictiva" -ForegroundColor Red
        $issues += "ExecutionPolicy restrictiva impide ejecutar scripts"
        $fixes += "Ejecutar: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    } else {
        Write-Host "   ✅ ExecutionPolicy permite scripts" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  No se pudo verificar ExecutionPolicy" -ForegroundColor Yellow
}

# 6. Verificar conectividad de red local
Write-Host ""
Write-Host "🔍 6. Verificando conectividad local..." -ForegroundColor Yellow

try {
    $localhost = Test-Connection -ComputerName "localhost" -Count 1 -Quiet
    if ($localhost) {
        Write-Host "   ✅ Conectividad local OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Problemas de conectividad local" -ForegroundColor Red
        $issues += "Problemas de conectividad local"
    }
} catch {
    Write-Host "   ⚠️  No se pudo verificar conectividad" -ForegroundColor Yellow
}

# Resumen de problemas
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Blue
Write-Host "📋 RESUMEN DEL DIAGNOSTICO" -ForegroundColor Blue
Write-Host "=" * 70 -ForegroundColor Blue

if ($issues.Count -eq 0) {
    Write-Host ""
    Write-Host "🎉 NO SE ENCONTRARON PROBLEMAS" -ForegroundColor Green
    Write-Host "   El sistema debería funcionar correctamente" -ForegroundColor Green
    Write-Host "   Si persisten problemas, intente:" -ForegroundColor Yellow
    Write-Host "   • .\start-all.ps1" -ForegroundColor White
    Write-Host "   • Esperar 60 segundos" -ForegroundColor White  
    Write-Host "   • .\start-check.ps1" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "❌ PROBLEMAS ENCONTRADOS ($($issues.Count)):" -ForegroundColor Red
    Write-Host ""
    
    for ($i = 0; $i -lt $issues.Count; $i++) {
        Write-Host "   $($i + 1). $($issues[$i])" -ForegroundColor Red
        if ($i -lt $fixes.Count) {
            Write-Host "      🔧 Solución: $($fixes[$i])" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    if ($AutoFix) {
        Write-Host "🔧 APLICANDO CORRECCIONES AUTOMÁTICAS..." -ForegroundColor Cyan
        
        # Auto-fix ExecutionPolicy
        if ($issues -contains "ExecutionPolicy restrictiva impide ejecutar scripts") {
            try {
                Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
                Write-Host "✅ ExecutionPolicy actualizada" -ForegroundColor Green
            } catch {
                Write-Host "❌ Error actualizando ExecutionPolicy" -ForegroundColor Red
            }
        }
        
        # Auto-fix dependencias
        if ($issues -like "*dependencias*frontend*") {
            Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
            Push-Location "frontend"
            try {
                cmd /c "npm install"
                Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
            } catch {
                Write-Host "❌ Error instalando dependencias del frontend" -ForegroundColor Red
            } finally {
                Pop-Location
            }
        }
    }
}

Write-Host ""
Write-Host "💡 COMANDOS ÚTILES:" -ForegroundColor Cyan
Write-Host "   .\diagnostico.ps1 -AutoFix     # Corregir problemas automáticamente" -ForegroundColor Gray
Write-Host "   .\diagnostico.ps1 -Verbose     # Información detallada" -ForegroundColor Gray
Write-Host "   .\start-all.ps1               # Iniciar el sistema" -ForegroundColor Gray
Write-Host "   .\start-check.ps1             # Verificar estado" -ForegroundColor Gray
Write-Host "   .\stop-all.ps1                # Detener todos los procesos" -ForegroundColor Gray

Write-Host ""