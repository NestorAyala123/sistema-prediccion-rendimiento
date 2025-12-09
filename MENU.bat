@echo off
chcp 65001 > nul
cls

:MENU
echo.
echo =====================================================
echo   SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO
echo =====================================================
echo.
echo   1. Iniciar Sistema Completo
echo   2. Solo Frontend
echo   3. Solo Backend
echo   4. Verificar Estado
echo   5. Detener Todo
echo   6. Salir
echo.
echo =====================================================
echo.

set /p opcion="Selecciona una opción (1-6): "

if "%opcion%"=="1" goto COMPLETO
if "%opcion%"=="2" goto FRONTEND
if "%opcion%"=="3" goto BACKEND
if "%opcion%"=="4" goto ESTADO
if "%opcion%"=="5" goto DETENER
if "%opcion%"=="6" goto SALIR

echo Opción inválida. Intenta de nuevo.
pause
goto MENU

:COMPLETO
echo.
echo Iniciando sistema completo...
powershell.exe -ExecutionPolicy Bypass -File ".\start-simple.ps1"
pause
goto MENU

:FRONTEND
echo.
echo Iniciando solo frontend...
powershell.exe -ExecutionPolicy Bypass -File ".\start-simple.ps1" -FrontendOnly
pause
goto MENU

:BACKEND
echo.
echo Iniciando solo backend...
powershell.exe -ExecutionPolicy Bypass -File ".\start-simple.ps1" -BackendOnly
pause
goto MENU

:ESTADO
echo.
echo Verificando estado del sistema...
echo.
echo Procesos Node.js activos:
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find "node.exe"
if %ERRORLEVEL% NEQ 0 echo No hay procesos Node.js ejecutándose
echo.
echo Verificando puertos:
netstat -an | find "3000"
netstat -an | find "3001"
echo.
pause
goto MENU

:DETENER
echo.
echo Deteniendo todos los procesos...
taskkill /F /IM node.exe 2>nul
echo Procesos detenidos.
pause
goto MENU

:SALIR
echo.
echo ¡Hasta luego!
exit /b 0