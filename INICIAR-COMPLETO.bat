@echo off
chcp 65001 > nul
color 0B
cls

echo ========================================
echo    SISTEMA DE PREDICCIÓN ACADÉMICA
echo    Backend + Frontend
echo ========================================
echo.

echo ⏳ Deteniendo procesos previos...
taskkill /F /IM node.exe > nul 2>&1
timeout /t 2 > nul

echo ✅ Listo para iniciar
echo.

echo ========================================
echo PASO 1: Iniciando Backend (Puerto 4000)
echo ========================================
start "BACKEND - NestJS" cmd /k "cd /d %~dp0backend && color 0A && echo ======================================== && echo          BACKEND - NestJS && echo     http://localhost:4000 && echo ======================================== && echo. && npm run start:dev"

echo ⏳ Esperando 5 segundos para que el backend inicie...
timeout /t 5 > nul

echo.
echo ========================================
echo PASO 2: Iniciando Frontend (Puerto 3000)
echo ========================================
start "FRONTEND - React" cmd /k "cd /d %~dp0frontend && color 09 && echo ======================================== && echo          FRONTEND - React && echo     http://localhost:3000 && echo ======================================== && echo. && npm start"

echo.
echo ⏳ Abriendo navegador en 8 segundos...
timeout /t 8 > nul

start http://localhost:3000

echo.
echo ========================================
echo   ✅ SISTEMA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo 📊 URLs disponibles:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:4000
echo.
echo 📝 Información importante:
echo    - Los datos se guardan en SQLite (backend/database/)
echo    - Cierra las ventanas para detener
echo.
echo Para detener: Cierra las ventanas de Backend y Frontend
echo.

pause
