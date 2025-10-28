# Comprueba los endpoints del frontend y backend
# Ejecutar desde la raíz del proyecto.

$backendUrl = 'http://localhost:4000/health'
$frontendUrl = 'http://localhost:3000'

Write-Host "Comprobando backend: $backendUrl"
try {
    $r = Invoke-WebRequest -UseBasicParsing -Uri $backendUrl -TimeoutSec 5
    Write-Host "Backend OK - Status:" $r.StatusCode
    Write-Host $r.Content
} catch {
    Write-Host "Backend NO disponible:" $_.Exception.Message -ForegroundColor Red
}

Write-Host "\nComprobando frontend: $frontendUrl"
try {
    $r2 = Invoke-WebRequest -UseBasicParsing -Uri $frontendUrl -TimeoutSec 5
    Write-Host "Frontend OK - Status:" $r2.StatusCode
} catch {
    Write-Host "Frontend NO disponible:" $_.Exception.Message -ForegroundColor Red
}
