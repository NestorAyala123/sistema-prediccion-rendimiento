# 🎯 SISTEMA DE PREDICCIÓN DE RENDIMIENTO ACADÉMICO

## 🚀 INICIO RÁPIDO (1 CLIC)

### ✅ MÉTODO RECOMENDADO
**Hacer doble clic en:** `INICIAR.bat`

```
✅ Configura permisos automáticamente
✅ Verifica dependencias
✅ Instala automáticamente si es necesario  
✅ Abre el navegador automáticamente
✅ Funciona sin conocimientos técnicos
```

### 🔐 CREDENCIALES DE ACCESO
- **Email:** `admin@universidad.edu` (o cualquier email válido)
- **Contraseña:** `123456` (o cualquier contraseña)

---

## 📋 MÉTODOS ALTERNATIVOS DE INICIO

### Opción 2: Menú Completo
```batch
menu-principal.bat
```
- Menú interactivo con múltiples opciones
- Control de estado del sistema en tiempo real
- Opciones para frontend/backend por separado

### Opción 3: PowerShell (Avanzado)
```powershell
# Sistema completo
.\start-all.ps1

# Solo frontend
.\start-all.ps1 -FrontendOnly

# Solo backend  
.\start-all.ps1 -BackendOnly
```

### Opción 4: Manual (Desarrolladores)
```bash
cd frontend
npm install
npm start
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Scripts deshabilitados"
**Solución automática:** Ejecutar `INICIAR.bat` (ya incluye la corrección)

**Solución manual:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Error: "Node.js no encontrado"
1. Descargar desde: https://nodejs.org/
2. Instalar la versión LTS
3. Reiniciar terminal/equipo
4. Ejecutar `INICIAR.bat` nuevamente

### ❌ Error: "Puerto ocupado"
```powershell
.\stop-all.ps1  # Detiene todos los procesos
.\INICIAR.bat   # Reinicia el sistema
```

### ❌ Error: "Dependencias faltantes"
El archivo `INICIAR.bat` las instala automáticamente.

---

## 🌐 URLS Y PUERTOS

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Aplicación** | http://localhost:3000 | 3000 |
| **Login** | http://localhost:3000/login | 3000 |
| **API Backend** | http://localhost:3001 | 3001 |

---

## 🎮 CARACTERÍSTICAS DEL SISTEMA

### 🔐 **Sistema de Login**
- Multiidioma (Español/English)
- Modo demo funcional
- Bienvenida personalizada por hora del día

### 👥 **Gestión de Estudiantes**
- Búsqueda en tiempo real con filtros
- Menú lateral expandible con atajos
- Estadísticas dinámicas
- Estados de riesgo académico

### ⌨️ **Atajos de Teclado**
- `Ctrl + N`: Nuevo estudiante
- `Ctrl + F`: Buscar
- `Ctrl + B`: Toggle menú lateral
- `Escape`: Cerrar modal/menú

### 📊 **Dashboard**
- Métricas en tiempo real
- Bienvenida personalizada
- Tarjetas de estadísticas
- Navegación intuitiva

---

## 🛠️ HERRAMIENTAS DE ADMINISTRACIÓN

### 📊 Verificar Estado
```powershell
.\start-check.ps1
.\start-check.ps1 -Detailed
```

### 🔍 Diagnóstico Completo
```powershell
.\diagnostico.ps1
.\diagnostico.ps1 -AutoFix
```

### 🛑 Detener Servicios
```powershell
.\stop-all.ps1
.\stop-all.ps1 -Force
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
sistema-prediccion-rendimiento/
├── INICIAR.bat                 ← ⭐ USAR ESTE ARCHIVO
├── menu-principal.bat          ← Menú interactivo
├── start-all.ps1              ← Script PowerShell principal
├── start-check.ps1            ← Verificador de estado
├── stop-all.ps1               ← Detener servicios
├── diagnostico.ps1            ← Diagnóstico del sistema
├── frontend/                   ← Aplicación React
│   ├── src/
│   └── package.json
├── backend/                    ← API Node.js/NestJS
├── docs/                       ← Documentación
└── README.md
```

---

## 🆘 SOPORTE Y AYUDA

### 🔄 Secuencia de Solución de Problemas
1. **Ejecutar:** `INICIAR.bat`
2. **Si falla:** `.\diagnostico.ps1 -AutoFix`
3. **Verificar:** `.\start-check.ps1`
4. **Si persiste:** Reiniciar terminal y repetir

### 📞 Problemas Comunes
- **"No funciona"** → Usar `INICIAR.bat`
- **"Puerto ocupado"** → Usar `.\stop-all.ps1`
- **"Permisos"** → Ya están incluidos en `INICIAR.bat`
- **"Dependencias"** → Se instalan automáticamente

### 🌟 Características Destacadas
- ✅ **Instalación automática** de dependencias
- ✅ **Corrección automática** de permisos
- ✅ **Detección automática** de problemas
- ✅ **Apertura automática** del navegador
- ✅ **Modo demo** sin configuración
- ✅ **Multiidioma** español/inglés
- ✅ **Responsive** móvil y escritorio

---

## 🎉 ¡COMENZAR AHORA!

### Para Usuarios Finales:
1. **Doble clic** en `INICIAR.bat`
2. **Esperar** que se abra el navegador
3. **Usar credenciales:** `cualquier@email.com` / `cualquier_password`

### Para Desarrolladores:
1. **Ejecutar** `menu-principal.bat`
2. **Seleccionar opción** según necesidad
3. **Usar scripts** PowerShell para control avanzado

**¡El sistema está listo en menos de 2 minutos!** 🚀