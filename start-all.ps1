# Inicia backend y frontend en nuevas ventanas de PowerShell
# Uso: Ejecutar desde la raíz del proyecto (Start-Process abrirá nuevas ventanas)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'

Write-Host "Iniciando backend en: $backendPath"
Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit -Command cd '$backendPath'; npm.cmd run start:dev" -WindowStyle Normal

Start-Sleep -Milliseconds 500

Write-Host "Iniciando frontend en: $frontendPath"
Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoExit -Command cd '$frontendPath'; npm.cmd start" -WindowStyle Normal

Write-Host 'Ambos procesos fueron lanzados en nuevas ventanas. Espera unos segundos y usa start-check.ps1 para verificar.'
