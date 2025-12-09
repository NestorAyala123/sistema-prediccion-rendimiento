@echo off
title Sistema de Prediccion - Menu Principal
color 0B

:menu
cls
echo.
echo  ===============================================================
echo    SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO - v2.0
echo  ===============================================================
echo.
echo  Estado del sistema:
powershell -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 2; Write-Host '   Frontend: ACTIVO (Puerto 3000)' -ForegroundColor Green } catch { Write-Host '   Frontend: INACTIVO' -ForegroundColor Red }"
powershell -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3001' -TimeoutSec 2; Write-Host '   Backend:  ACTIVO (Puerto 3001)' -ForegroundColor Green } catch { Write-Host '   Backend:  INACTIVO' -ForegroundColor Red }"
echo.
echo  ===============================================================
echo  Opciones disponibles:
echo.
echo  [1] Iniciar Sistema Completo (Frontend + Backend)
echo  [2] Iniciar Solo Frontend
echo  [3] Iniciar Solo Backend  
echo  [4] Verificar Estado del Sistema
echo  [5] Detener Todos los Procesos
echo  [6] Abrir en Navegador
echo  [7] Ver Logs/Documentacion
echo  [0] Salir
echo.
echo  ===============================================================

set /p choice="Seleccione una opcion (0-7): "

if "%choice%"=="1" goto fullsystem
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto backend
if "%choice%"=="4" goto check
if "%choice%"=="5" goto stop
if "%choice%"=="6" goto browser
if "%choice%"=="7" goto docs
if "%choice%"=="0" goto exit

echo.
echo Opcion invalida. Presione cualquier tecla para continuar...
pause >nul
goto menu

:fullsystem
echo.
echo ===============================================================
echo  INICIANDO SISTEMA COMPLETO
echo ===============================================================
echo.
echo Ejecutando PowerShell para iniciar frontend y backend...
powershell -ExecutionPolicy Bypass -File "start-all.ps1"
echo.
echo Sistema iniciado. Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:frontend
echo.
echo ===============================================================
echo  INICIANDO SOLO FRONTEND
echo ===============================================================
echo.
powershell -ExecutionPolicy Bypass -File "start-all.ps1" -FrontendOnly
echo.
echo Frontend iniciado. Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:backend
echo.
echo ===============================================================
echo  INICIANDO SOLO BACKEND  
echo ===============================================================
echo.
powershell -ExecutionPolicy Bypass -File "start-all.ps1" -BackendOnly
echo.
echo Backend iniciado. Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:check
echo.
echo ===============================================================
echo  VERIFICANDO ESTADO DEL SISTEMA
echo ===============================================================
echo.
powershell -ExecutionPolicy Bypass -File "start-check.ps1" -Detailed
echo.
echo Verificacion completa. Presione cualquier tecla para continuar...
pause >nul
goto menu

:stop
echo.
echo ===============================================================
echo  DETENIENDO TODOS LOS PROCESOS
echo ===============================================================
echo.
echo ATENCION: Esto terminara todos los procesos Node.js del sistema
set /p confirm="¿Esta seguro? (Y/N): "
if /i "%confirm%"=="Y" (
    powershell -ExecutionPolicy Bypass -File "stop-all.ps1" -Confirm:$false
) else (
    echo Operacion cancelada.
)
echo.
echo Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:browser
echo.
echo ===============================================================
echo  ABRIENDO EN NAVEGADOR
echo ===============================================================
echo.
echo Verificando que el sistema este activo...
powershell -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host 'Sistema activo. Abriendo navegador...' -ForegroundColor Green; Start-Process 'http://localhost:3000' } catch { Write-Host 'Sistema no disponible. Inicie el sistema primero.' -ForegroundColor Red }"
echo.
echo Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:docs
echo.
echo ===============================================================
echo  DOCUMENTACION Y LOGS
echo ===============================================================
echo.
echo [1] README Principal
echo [2] Guia de Inicio Rapido  
echo [3] Documentacion de API
echo [4] Logs del Sistema
echo [0] Volver al menu principal
echo.
set /p docChoice="Seleccione opcion: "

if "%docChoice%"=="1" (
    if exist "README.md" (
        start README.md
    ) else (
        echo README.md no encontrado
    )
)
if "%docChoice%"=="2" (
    if exist "INICIO-RAPIDO.md" (
        start INICIO-RAPIDO.md
    ) else (
        echo Guia de inicio rapido no encontrada
    )
)
if "%docChoice%"=="3" (
    if exist "docs\" (
        explorer docs
    ) else (
        echo Carpeta de documentacion no encontrada
    )
)
if "%docChoice%"=="4" (
    echo Logs del sistema:
    echo Frontend: Verificar la consola del navegador (F12)
    echo Backend: Verificar la ventana de PowerShell del backend
)
if "%docChoice%"=="0" goto menu

echo.
echo Presione cualquier tecla para volver al menu...
pause >nul
goto menu

:exit
echo.
echo ===============================================================
echo  CERRANDO SISTEMA
echo ===============================================================
echo.
echo ¿Desea detener todos los procesos antes de salir?
set /p stopChoice="(Y/N): "
if /i "%stopChoice%"=="Y" (
    echo Deteniendo procesos...
    powershell -ExecutionPolicy Bypass -File "stop-all.ps1" -Force -Confirm:$false
)
echo.
echo Gracias por usar el Sistema de Prediccion de Rendimiento Academico
echo.
timeout 3
exit

:error
echo.
echo ===============================================================
echo  ERROR
echo ===============================================================
echo.
echo Ha ocurrido un error ejecutando el comando.
echo Verifique:
echo  - Que PowerShell este disponible
echo  - Que los archivos .ps1 existan en el directorio actual
echo  - Que tenga permisos de ejecucion
echo.
echo Para solucionar problemas de permisos ejecute:
echo powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
echo.
pause
goto menu