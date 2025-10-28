@echo off
REM Inicia backend y frontend en nuevas ventanas de cmd
set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

echo Iniciando backend...
start "Backend" powershell -NoExit -Command "cd '%BACKEND%'; npm.cmd run start:dev"

timeout /t 1 /nobreak >nul

echo Iniciando frontend...
start "Frontend" powershell -NoExit -Command "cd '%FRONTEND%'; npm.cmd start"

echo Hecho. Se han abierto nuevas ventanas para backend y frontend.
