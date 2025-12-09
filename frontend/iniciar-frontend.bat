@echo off
echo Iniciando Sistema de Prediccion de Rendimiento Academico - Frontend
echo ================================================================
cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo Error: Node.js no está instalado o no está en el PATH
    pause
    exit /b 1
)

echo.
echo Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo Error: npm no está disponible
    pause
    exit /b 1
)

echo.
echo Instalando dependencias (si es necesario)...
if not exist "node_modules" (
    echo Instalando dependencias por primera vez...
    npm install
    if %errorlevel% neq 0 (
        echo Error al instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo Dependencias ya instaladas.
)

echo.
echo ================================================================
echo Iniciando el servidor de desarrollo en http://localhost:3000
echo Presiona Ctrl+C para detener el servidor
echo ================================================================
echo.

npm start
pause