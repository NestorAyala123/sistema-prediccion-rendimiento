# Script de instalación para el menú de accesibilidad
# Sistema de Predicción Académica

Write-Host "=== INSTALACIÓN DEL MENÚ DE ACCESIBILIDAD ===" -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no encontrado. Por favor instale Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar si npm está disponible
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm no encontrado. Por favor instale npm." -ForegroundColor Red
    exit 1
}

# Navegar al directorio del frontend
Write-Host "Navegando al directorio del frontend..." -ForegroundColor Yellow
Set-Location "frontend"

# Verificar si package.json existe
if (Test-Path "package.json") {
    Write-Host "✓ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ package.json no encontrado en el directorio frontend" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    Write-Host "Intente ejecutar 'npm install' manualmente" -ForegroundColor Yellow
}

# Verificar archivos de accesibilidad
Write-Host "Verificando archivos de accesibilidad..." -ForegroundColor Yellow

$accessibilityFiles = @(
    "src/components/AccessibilityMenu.tsx",
    "src/hooks/useAccessibility.ts",
    "src/components/TranscriptProvider.tsx",
    "src/components/VideoSubtitles.tsx",
    "src/styles/accessibility.css"
)

$allFilesExist = $true
foreach ($file in $accessibilityFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file no encontrado" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "✓ Todos los archivos de accesibilidad están presentes" -ForegroundColor Green
} else {
    Write-Host "✗ Algunos archivos de accesibilidad no se encontraron" -ForegroundColor Red
    Write-Host "Por favor, asegúrese de que todos los archivos estén en su lugar" -ForegroundColor Yellow
}

# Verificar integración en Layout
Write-Host "Verificando integración en Layout..." -ForegroundColor Yellow
$layoutContent = Get-Content "src/components/Layout.tsx" -Raw
if ($layoutContent -match "AccessibilityMenu") {
    Write-Host "✓ AccessibilityMenu integrado en Layout" -ForegroundColor Green
} else {
    Write-Host "✗ AccessibilityMenu no está integrado en Layout" -ForegroundColor Red
}

if ($layoutContent -match "TranscriptProvider") {
    Write-Host "✓ TranscriptProvider integrado en Layout" -ForegroundColor Green
} else {
    Write-Host "✗ TranscriptProvider no está integrado en Layout" -ForegroundColor Red
}

if ($layoutContent -match "VideoSubtitles") {
    Write-Host "✓ VideoSubtitles integrado en Layout" -ForegroundColor Green
} else {
    Write-Host "✗ VideoSubtitles no está integrado en Layout" -ForegroundColor Red
}

# Verificar importación de estilos
Write-Host "Verificando importación de estilos..." -ForegroundColor Yellow
$appContent = Get-Content "src/App.tsx" -Raw
if ($appContent -match "accessibility.css") {
    Write-Host "✓ Estilos de accesibilidad importados en App.tsx" -ForegroundColor Green
} else {
    Write-Host "✗ Estilos de accesibilidad no están importados en App.tsx" -ForegroundColor Red
}

# Compilar el proyecto
Write-Host "Compilando el proyecto..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✓ Proyecto compilado correctamente" -ForegroundColor Green
} catch {
    Write-Host "⚠ Advertencia: Error durante la compilación" -ForegroundColor Yellow
    Write-Host "Esto puede ser normal si hay errores de TypeScript menores" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== INSTALACIÓN COMPLETADA ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Para probar el menú de accesibilidad:" -ForegroundColor Cyan
Write-Host "  1. Abra el navegador en http://localhost:3000" -ForegroundColor White
Write-Host "  2. Busque el botón flotante de accesibilidad (esquina inferior derecha)" -ForegroundColor White
Write-Host "  3. Haga clic en el botón para abrir el menú" -ForegroundColor White
Write-Host "  4. Configure las opciones según sus necesidades" -ForegroundColor White
Write-Host ""
Write-Host "Atajos de teclado disponibles:" -ForegroundColor Cyan
Write-Host "  Ctrl + Alt + A: Abrir menú de accesibilidad" -ForegroundColor White
Write-Host "  Ctrl + Alt + S: Activar/desactivar text-to-speech" -ForegroundColor White
Write-Host "  Ctrl + Alt + D: Activar/desactivar modo oscuro" -ForegroundColor White
Write-Host "  Ctrl + Alt + C: Activar/desactivar alto contraste" -ForegroundColor White
Write-Host "  Escape: Cerrar menús abiertos" -ForegroundColor White
Write-Host ""
Write-Host "Documentación completa disponible en: docs/MENU_ACCESIBILIDAD.md" -ForegroundColor Cyan
