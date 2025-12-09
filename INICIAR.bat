@echo off
chcp 65001 >nul
title Sistema de Predicción Académica - Inicio Optimizado
color 0A

echo.
echo  ===============================================================
echo    SISTEMA DE PREDICCIÓN ACADÉMICA - INICIO OPTIMIZADO
echo  ===============================================================
echo.

echo [1/5] Configurando permisos de PowerShell...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Permisos configurados correctamente
) else (
    echo ⚠️ No se pudieron configurar permisos automáticamente
)

echo.
echo [2/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado
    node --version
) else (
    echo ❌ Node.js no encontrado
    echo Descargue Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [3/5] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm encontrado
    npm --version
) else (
    echo ❌ npm no encontrado
    pause
    exit /b 1
)

echo.
echo [4/5] Deteniendo procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ Procesos anteriores detenidos

echo.
echo [5/5] Instalando/Verificando dependencias del frontend...
cd frontend
if not exist "node_modules" (
    echo 📦 Instalando dependencias por primera vez...
    echo Esto puede tomar varios minutos...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo ===============================================================
echo  🚀 INICIANDO SISTEMA
echo ===============================================================
echo.
echo • La aplicación se abrirá en: http://localhost:3000
echo • Credenciales de demo: cualquier email/password
echo • Presione Ctrl+C para detener el servidor
echo.
echo 💡 NOTA: El sistema funciona sin backend usando localStorage
echo    Los datos se guardan localmente en tu navegador
echo.

:: Abrir navegador después de unos segundos
start "" /min cmd /c "timeout /t 8 >nul & start http://localhost:3000"

:: Iniciar servidor
call npm start

cd ..
pause