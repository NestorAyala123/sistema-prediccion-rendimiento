# Script para probar la funcionalidad de guardar asistencias

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "PRUEBA DE GUARDADO DE ASISTENCIAS" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Iniciar sesión como docente
Write-Host "1. Iniciando sesión como docente..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body (@{
    email = "carlos.rodriguez@universidad.edu"
    password = "Carlos@2024"
} | ConvertTo-Json)

if ($loginResponse.access_token) {
    Write-Host "✓ Login exitoso" -ForegroundColor Green
    $token = $loginResponse.access_token
} else {
    Write-Host "✗ Error en login" -ForegroundColor Red
    exit
}

Write-Host ""

# 2. Obtener lista de estudiantes
Write-Host "2. Obteniendo lista de estudiantes..." -ForegroundColor Yellow
$estudiantes = Invoke-RestMethod -Uri "http://localhost:4000/estudiantes" -Method GET -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "✓ Estudiantes obtenidos: $($estudiantes.Count)" -ForegroundColor Green
Write-Host ""

# 3. Obtener lista de asignaturas
Write-Host "3. Obteniendo lista de asignaturas..." -ForegroundColor Yellow
$asignaturas = Invoke-RestMethod -Uri "http://localhost:4000/asignaturas" -Method GET -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "✓ Asignaturas obtenidas: $($asignaturas.Count)" -ForegroundColor Green
Write-Host ""

# 4. Preparar datos de asistencias
if ($estudiantes.Count -gt 0 -and $asignaturas.Count -gt 0) {
    $asignatura = $asignaturas[0]
    Write-Host "4. Preparando asistencias para: $($asignatura.nombre_asignatura)" -ForegroundColor Yellow
    
    $asistencias = @()
    $contador = 0
    foreach ($estudiante in $estudiantes) {
        $estado = if ($contador % 2 -eq 0) { "Presente" } else { "Ausente" }
        $asistencias += @{
            id_estudiante = $estudiante.id_estudiante
            estado = $estado
        }
        $contador++
    }

    Write-Host "✓ Asistencias preparadas: $($asistencias.Count)" -ForegroundColor Green
    Write-Host ""

    # 5. Enviar asistencias al backend
    Write-Host "5. Enviando asistencias al backend..." -ForegroundColor Yellow
    
    $fecha = Get-Date -Format "yyyy-MM-dd"
    $body = @{
        id_asignatura = $asignatura.id_asignatura
        fecha_clase = $fecha
        periodo_academico = "2025-01"
        asistencias = $asistencias
    } | ConvertTo-Json -Depth 5

    Write-Host "Datos enviados:" -ForegroundColor Cyan
    Write-Host $body -ForegroundColor Gray
    Write-Host ""

    try {
        $resultado = Invoke-RestMethod -Uri "http://localhost:4000/asistencias/lote" -Method POST -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        } -Body $body

        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "✓ ASISTENCIAS GUARDADAS EXITOSAMENTE" -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Resultados:" -ForegroundColor Cyan
        Write-Host "  - Exitosos: $($resultado.exitosos)" -ForegroundColor Green
        Write-Host "  - Fallidos: $($resultado.fallidos)" -ForegroundColor $(if ($resultado.fallidos -gt 0) { "Red" } else { "Green" })
        
        $problemList = $resultado.errores
        if ($problemList -and $problemList.Count -gt 0) {
            Write-Host ""
            Write-Host "Problemas encontrados:" -ForegroundColor Red
            foreach ($item in $problemList) {
                $studentId = $item.id_estudiante
                $message = $item.PSObject.Properties['error'].Value
                Write-Host "  - Estudiante ${studentId}: $message" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "==================================================" -ForegroundColor Red
        Write-Host "✗ ERROR AL GUARDAR ASISTENCIAS" -ForegroundColor Red
        Write-Host "==================================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Mensaje de error:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        if ($_.ErrorDetails) {
            Write-Host "Detalles:" -ForegroundColor Red
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
    }
} else {
    Write-Host "✗ No se encontraron estudiantes o asignaturas" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "FIN DE LA PRUEBA" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
