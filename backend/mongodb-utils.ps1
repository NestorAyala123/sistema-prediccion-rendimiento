# Comandos útiles de MongoDB para el proyecto

Write-Host "=== MongoDB - Comandos Útiles ===" -ForegroundColor Cyan
Write-Host ""

$comando = ""
while ($comando -ne "0") {
    Write-Host "Seleccione una opción:" -ForegroundColor Yellow
    Write-Host "1. Conectar a MongoDB" -ForegroundColor White
    Write-Host "2. Ver todas las bases de datos" -ForegroundColor White
    Write-Host "3. Ver colecciones de academic_prediction" -ForegroundColor White
    Write-Host "4. Ver últimas 10 auditorías" -ForegroundColor White
    Write-Host "5. Ver estadísticas de la base de datos" -ForegroundColor White
    Write-Host "6. Limpiar auditorías antiguas (90+ días)" -ForegroundColor White
    Write-Host "7. Backup de la base de datos" -ForegroundColor White
    Write-Host "8. Restaurar backup" -ForegroundColor White
    Write-Host "9. Iniciar servicio MongoDB" -ForegroundColor White
    Write-Host "10. Detener servicio MongoDB" -ForegroundColor White
    Write-Host "0. Salir" -ForegroundColor Red
    Write-Host ""
    
    $comando = Read-Host "Opción"
    Write-Host ""
    
    $mongoShell = "C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"
    
    switch ($comando) {
        "1" {
            Write-Host "Conectando a MongoDB..." -ForegroundColor Cyan
            & $mongoShell
        }
        "2" {
            Write-Host "Bases de datos disponibles:" -ForegroundColor Cyan
            & $mongoShell --eval "show dbs"
        }
        "3" {
            Write-Host "Colecciones en academic_prediction:" -ForegroundColor Cyan
            & $mongoShell academic_prediction --eval "show collections"
        }
        "4" {
            Write-Host "Últimas 10 auditorías:" -ForegroundColor Cyan
            $script = @"
use academic_prediction
db.auditorias.find().sort({fecha: -1}).limit(10).forEach(printjson)
"@
            $script | & $mongoShell --quiet
        }
        "5" {
            Write-Host "Estadísticas de la base de datos:" -ForegroundColor Cyan
            & $mongoShell academic_prediction --eval "db.stats()"
        }
        "6" {
            Write-Host "Eliminando auditorías antiguas..." -ForegroundColor Cyan
            $fechaLimite = (Get-Date).AddDays(-90).ToString("yyyy-MM-dd")
            $script = @"
use academic_prediction
var fecha = new Date('$fechaLimite')
var result = db.auditorias.deleteMany({fecha: {\$lt: fecha}})
print('Eliminados: ' + result.deletedCount + ' documentos')
"@
            $script | & $mongoShell --quiet
            Write-Host "✓ Completado" -ForegroundColor Green
        }
        "7" {
            Write-Host "Creando backup..." -ForegroundColor Cyan
            $fecha = Get-Date -Format "yyyyMMdd_HHmmss"
            $backupDir = "$PSScriptRoot\backups\mongodb_$fecha"
            
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
            
            $mongodump = "C:\Program Files\MongoDB\Server\7.0\bin\mongodump.exe"
            if (Test-Path $mongodump) {
                & $mongodump --db=academic_prediction --out=$backupDir
                Write-Host "✓ Backup creado en: $backupDir" -ForegroundColor Green
            } else {
                Write-Host "⚠ mongodump no encontrado" -ForegroundColor Yellow
            }
        }
        "8" {
            Write-Host "Backups disponibles:" -ForegroundColor Cyan
            $backups = Get-ChildItem "$PSScriptRoot\backups" -Directory | Sort-Object Name -Descending
            
            if ($backups.Count -eq 0) {
                Write-Host "No hay backups disponibles" -ForegroundColor Yellow
            } else {
                for ($i = 0; $i -lt $backups.Count; $i++) {
                    Write-Host "$($i + 1). $($backups[$i].Name)" -ForegroundColor White
                }
                
                $seleccion = Read-Host "Seleccione backup a restaurar (número)"
                
                if ($seleccion -match '^\d+$' -and [int]$seleccion -le $backups.Count) {
                    $backupPath = $backups[[int]$seleccion - 1].FullName
                    
                    Write-Host "Restaurando desde: $backupPath" -ForegroundColor Cyan
                    
                    $mongorestore = "C:\Program Files\MongoDB\Server\7.0\bin\mongorestore.exe"
                    if (Test-Path $mongorestore) {
                        & $mongorestore --db=academic_prediction --drop "$backupPath\academic_prediction"
                        Write-Host "✓ Restauración completada" -ForegroundColor Green
                    } else {
                        Write-Host "⚠ mongorestore no encontrado" -ForegroundColor Yellow
                    }
                }
            }
        }
        "9" {
            Write-Host "Iniciando servicio MongoDB..." -ForegroundColor Cyan
            $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
            if ($null -ne $service) {
                Start-Service -Name "MongoDB"
                Write-Host "✓ Servicio iniciado" -ForegroundColor Green
            } else {
                Write-Host "Iniciando MongoDB manualmente..." -ForegroundColor Cyan
                $mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
                Start-Process -FilePath $mongoPath -ArgumentList "--dbpath `"C:\data\db`"" -WindowStyle Hidden
                Write-Host "✓ MongoDB iniciado" -ForegroundColor Green
            }
        }
        "10" {
            Write-Host "Deteniendo servicio MongoDB..." -ForegroundColor Cyan
            $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
            if ($null -ne $service) {
                Stop-Service -Name "MongoDB"
                Write-Host "✓ Servicio detenido" -ForegroundColor Green
            } else {
                Write-Host "⚠ Servicio no encontrado. Deteniendo proceso manualmente..." -ForegroundColor Yellow
                Stop-Process -Name "mongod" -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Proceso detenido" -ForegroundColor Green
            }
        }
        "0" {
            Write-Host "¡Hasta luego!" -ForegroundColor Cyan
        }
        default {
            Write-Host "Opción no válida" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    if ($comando -ne "0") {
        Read-Host "Presione Enter para continuar"
        Clear-Host
        Write-Host "=== MongoDB - Comandos Útiles ===" -ForegroundColor Cyan
        Write-Host ""
    }
}
