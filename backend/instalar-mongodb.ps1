# Script para instalar y configurar MongoDB en Windows

Write-Host "=== Instalación y Configuración de MongoDB ===" -ForegroundColor Cyan

# Verificar si MongoDB está instalado
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
if (Test-Path $mongoPath) {
    Write-Host "✓ MongoDB ya está instalado" -ForegroundColor Green
} else {
    Write-Host "MongoDB no está instalado" -ForegroundColor Yellow
    Write-Host "Opciones de instalación:" -ForegroundColor Yellow
    Write-Host "1. Descargar desde: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "2. O usar Chocolatey: choco install mongodb" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "¿Desea instalar con Chocolatey? (s/n)"
    
    if ($install -eq "s") {
        # Verificar si Chocolatey está instalado
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            Write-Host "Instalando MongoDB con Chocolatey..." -ForegroundColor Cyan
            choco install mongodb -y
        } else {
            Write-Host "Chocolatey no está instalado. Por favor instálelo primero:" -ForegroundColor Red
            Write-Host "https://chocolatey.org/install" -ForegroundColor Yellow
            exit
        }
    } else {
        Write-Host "Por favor instale MongoDB manualmente y vuelva a ejecutar este script" -ForegroundColor Yellow
        exit
    }
}

# Crear directorios de datos si no existen
$dataDir = "C:\data\db"
if (-not (Test-Path $dataDir)) {
    Write-Host "Creando directorio de datos: $dataDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
    Write-Host "✓ Directorio creado" -ForegroundColor Green
}

# Verificar si el servicio de MongoDB está corriendo
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($null -eq $mongoService) {
    Write-Host "⚠ Servicio MongoDB no encontrado" -ForegroundColor Yellow
    Write-Host "Iniciando MongoDB manualmente..." -ForegroundColor Cyan
    
    # Iniciar MongoDB como proceso en segundo plano
    Start-Process -FilePath $mongoPath -ArgumentList "--dbpath `"$dataDir`"" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "✓ MongoDB iniciado" -ForegroundColor Green
} else {
    if ($mongoService.Status -eq "Running") {
        Write-Host "✓ MongoDB ya está corriendo" -ForegroundColor Green
    } else {
        Write-Host "Iniciando servicio MongoDB..." -ForegroundColor Cyan
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 2
        Write-Host "✓ Servicio iniciado" -ForegroundColor Green
    }
}

# Instalar dependencias de Node.js
Write-Host ""
Write-Host "Instalando dependencias de Node.js..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot"

if (Test-Path "package.json") {
    npm install @nestjs/mongoose mongoose
    Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠ package.json no encontrado. Asegúrate de estar en el directorio backend" -ForegroundColor Yellow
}

# Verificar conexión a MongoDB
Write-Host ""
Write-Host "Verificando conexión a MongoDB..." -ForegroundColor Cyan

$mongoShell = "C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"
if (Test-Path $mongoShell) {
    # Intentar conectar
    & $mongoShell --eval "db.version()" --quiet 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Conexión exitosa a MongoDB" -ForegroundColor Green
    } else {
        Write-Host "⚠ No se pudo conectar a MongoDB" -ForegroundColor Yellow
    }
}

# Crear base de datos y colecciones
Write-Host ""
Write-Host "Configurando base de datos..." -ForegroundColor Cyan

$setupScript = @"
use academic_prediction
db.createCollection('auditorias')
db.createCollection('predicciones_analisis')
db.createCollection('estadisticas')
print('Base de datos configurada correctamente')
"@

$setupScript | & $mongoShell --quiet

Write-Host ""
Write-Host "=== Instalación Completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Información útil:" -ForegroundColor Cyan
Write-Host "- MongoDB está corriendo en: mongodb://localhost:27017" -ForegroundColor White
Write-Host "- Base de datos: academic_prediction" -ForegroundColor White
Write-Host "- Directorio de datos: $dataDir" -ForegroundColor White
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "- Conectar: mongosh" -ForegroundColor White
Write-Host "- Ver DBs: show dbs" -ForegroundColor White
Write-Host "- Usar DB: use academic_prediction" -ForegroundColor White
Write-Host "- Ver colecciones: show collections" -ForegroundColor White
Write-Host ""
Write-Host "Actualiza tu archivo .env con:" -ForegroundColor Yellow
Write-Host "MONGODB_URI=mongodb://localhost:27017/academic_prediction" -ForegroundColor White
Write-Host ""

# Preguntar si desea abrir MongoDB Compass
Write-Host "¿Desea instalar MongoDB Compass (GUI)? (s/n)" -ForegroundColor Cyan
$compass = Read-Host

if ($compass -eq "s") {
    Write-Host "Descargando desde: https://www.mongodb.com/try/download/compass" -ForegroundColor Yellow
    Start-Process "https://www.mongodb.com/try/download/compass"
}

Write-Host ""
Write-Host "✓ Todo listo! Puedes iniciar el backend con: npm run start:dev" -ForegroundColor Green
