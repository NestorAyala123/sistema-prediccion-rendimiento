@echo off
title Sistema de Prediccion - Inicio Rapido
color 0A

echo.
echo  ===============================================================
echo        SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO
echo                        INICIO RAPIDO
echo  ===============================================================
echo.

cd /d "%~dp0frontend"

echo [1/3] Verificando entorno...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no encontrado. Instalelo desde https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias por primera vez...
    echo Esto puede tomar unos minutos...
    npm install --silent
    if %errorlevel% neq 0 (
        echo Error en la instalacion de dependencias
        pause
        exit /b 1
    )
)

echo [3/3] Iniciando aplicacion...
echo.
echo ===============================================================
echo  La aplicacion se iniciara en: http://localhost:3000
echo  
echo  CREDENCIALES DE DEMO:
echo  - Email: cualquier@email.com
echo  - Password: cualquier_password
echo  
echo  Presiona Ctrl+C para detener el servidor
echo ===============================================================
echo.

start "" "http://localhost:3000"
npm start