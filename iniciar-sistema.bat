@echo off
title Sistema de Prediccion de Rendimiento Academico - Launcher
color 0B

echo.
echo  ===============================================================
echo    SISTEMA DE PREDICCION DE RENDIMIENTO ACADEMICO
echo  ===============================================================
echo.
echo  Seleccione una opcion:
echo.
echo  [1] Iniciar solo Frontend (Puerto 3000)
echo  [2] Iniciar solo Backend (Puerto 3001)
echo  [3] Iniciar Frontend y Backend
echo  [4] Verificar instalacion de dependencias
echo  [5] Abrir documentacion
echo  [0] Salir
echo.
echo  ===============================================================

:menu
set /p choice="Ingrese su opcion (0-5): "

if "%choice%"=="1" goto frontend
if "%choice%"=="2" goto backend  
if "%choice%"=="3" goto fullstack
if "%choice%"=="4" goto verify
if "%choice%"=="5" goto docs
if "%choice%"=="0" goto exit
echo Opcion invalida. Intente nuevamente.
goto menu

:frontend
echo.
echo Iniciando Frontend...
cd frontend
if exist "iniciar-frontend.bat" (
    call iniciar-frontend.bat
) else (
    echo Archivo de inicio del frontend no encontrado.
    echo Intentando inicio directo...
    npm start
)
goto end

:backend
echo.
echo Iniciando Backend...
cd backend
if exist "package.json" (
    echo Instalando dependencias del backend si es necesario...
    npm install
    echo Iniciando servidor backend...
    npm run start:dev
) else (
    echo Backend no configurado correctamente.
)
goto end

:fullstack
echo.
echo Iniciando Frontend y Backend...
echo Abriendo ventana para Backend...
start cmd /k "cd backend && npm install && npm run start:dev"
timeout /t 3
echo Iniciando Frontend...
cd frontend
call iniciar-frontend.bat
goto end

:verify
echo.
echo Verificando instalacion...
echo.
echo Verificando Node.js:
node --version
echo.
echo Verificando npm:
npm --version
echo.
echo Verificando dependencias del Frontend:
cd frontend
if exist "node_modules" (
    echo [OK] Dependencias del Frontend instaladas
) else (
    echo [!] Dependencias del Frontend NO instaladas
    echo Ejecutando npm install...
    npm install
)
echo.
echo Verificando dependencias del Backend:
cd ..\backend
if exist "node_modules" (
    echo [OK] Dependencias del Backend instaladas
) else (
    echo [!] Dependencias del Backend NO instaladas
    echo Ejecutando npm install...
    npm install
)
echo.
pause
goto menu

:docs
echo.
echo Abriendo documentacion...
if exist "docs\README.md" (
    start docs\README.md
) else if exist "README.md" (
    start README.md
) else (
    echo No se encontro documentacion.
)
goto menu

:exit
echo.
echo Gracias por usar el Sistema de Prediccion de Rendimiento Academico
echo.
exit

:end
echo.
echo Proceso finalizado.
pause
goto menu