@echo off
REM Script de instalación y arranque del Sistema de Predicción Académica
REM Compatible con Windows PowerShell

SETLOCAL ENABLEDELAYEDEXPANSION

CLS
ECHO.
ECHO ===============================================
ECHO   Sistema de Predicción de Rendimiento Académico
ECHO   Guía de Instalación y Arranque
ECHO ===============================================
ECHO.

REM Verificar si Node.js está instalado
ECHO Verificando Node.js...
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO ERROR: Node.js no está instalado
    ECHO Descárgalo en: https://nodejs.org/
    PAUSE
    EXIT /B 1
)

ECHO [OK] Node.js detectado
ECHO.

REM Menú de opciones
ECHO Selecciona una opción:
ECHO 1 - Instalar dependencias (backend + frontend)
ECHO 2 - Arrancar backend
ECHO 3 - Arrancar frontend
ECHO 4 - Arrancar ambos (necesita dos terminales)
ECHO 5 - Limpiar y reinstalar
ECHO.

SET /P opcion="Ingresa el número (1-5): "

IF "%opcion%"=="1" GOTO instalar
IF "%opcion%"=="2" GOTO backend
IF "%opcion%"=="3" GOTO frontend
IF "%opcion%"=="4" GOTO ambos
IF "%opcion%"=="5" GOTO limpiar

ECHO Opción inválida
GOTO fin

:instalar
ECHO.
ECHO [*] Instalando dependencias del backend...
CD /D "%CD%\backend"
CALL npm install
ECHO [OK] Backend instalado

ECHO.
ECHO [*] Instalando dependencias del frontend...
CD /D "%CD%\..\frontend"
CALL npm install
ECHO [OK] Frontend instalado

ECHO.
ECHO [OK] Todas las dependencias instaladas correctamente
ECHO Próximo paso: Ejecutar "npm run start:dev" en backend y "npm start" en frontend
GOTO fin

:backend
ECHO.
ECHO [*] Arrancando backend en puerto 3001...
CD /D "%CD%\backend"
CALL npm run start:dev
GOTO fin

:frontend
ECHO.
ECHO [*] Arrancando frontend en puerto 3000...
CD /D "%CD%\frontend"
CALL npm start
GOTO fin

:ambos
ECHO.
ECHO Se recomienda usar dos terminales separadas
ECHO Terminal 1 - Backend:
ECHO   cd backend
ECHO   npm run start:dev
ECHO.
ECHO Terminal 2 - Frontend:
ECHO   cd frontend
ECHO   npm start
ECHO.
ECHO Presiona ENTER para abrir ambas terminales automáticamente...
PAUSE

REM Abrir terminal 1 para backend
START "Backend - Sistema de Predicción" CMD /K "cd backend & npm run start:dev"

REM Esperar un poco para que inicie backend
TIMEOUT /T 3 /NOBREAK

REM Abrir terminal 2 para frontend
START "Frontend - Sistema de Predicción" CMD /K "cd frontend & npm start"

ECHO [OK] Ambas terminales se han abierto
ECHO Espera a que ambos procesos estén listos:
ECHO   - Backend: "Nest application successfully started"
ECHO   - Frontend: "Compiled successfully"
GOTO fin

:limpiar
ECHO.
ECHO [*] Limpiando node_modules y reinstalando...

ECHO Limpiando backend...
CD /D "%CD%\backend"
IF EXIST "node_modules" RMDIR /S /Q node_modules
IF EXIST "package-lock.json" DEL package-lock.json
CALL npm install

ECHO Limpiando frontend...
CD /D "%CD%\..\frontend"
IF EXIST "node_modules" RMDIR /S /Q node_modules
IF EXIST "package-lock.json" DEL package-lock.json
CALL npm install

ECHO [OK] Limpieza y reinstalación completadas
GOTO fin

:fin
ECHO.
ECHO ===============================================
ECHO   Operación completada
ECHO ===============================================
PAUSE
