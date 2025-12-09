# 🚀 Inicio Rápido - Sistema de Predicción de Rendimiento Académico

## 📋 Requisitos Previos
- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)

## ⚡ Inicio Rápido (Recomendado)

### Opción 1: Ejecutable de Inicio Rápido
1. **Hacer doble clic** en `inicio-rapido.bat`
2. **Esperar** que se instalen las dependencias automáticamente
3. **Acceder** a http://localhost:3000 cuando se abra el navegador

### Opción 2: Menú Completo
1. **Ejecutar** `iniciar-sistema.bat`
2. **Seleccionar opción [1]** para iniciar solo el Frontend
3. **Acceder** a http://localhost:3000

### Opción 3: Manual (PowerShell/CMD)
```bash
cd frontend
npm install
npm start
```

## 🔐 Acceso al Sistema

### Credenciales de Demo
- **Email:** `admin@universidad.edu` (o cualquier email válido)
- **Contraseña:** `123456` (o cualquier contraseña)

### Funciones Disponibles
- ✅ **Login multiidioma** (Español/English)
- ✅ **Dashboard principal** con estadísticas
- ✅ **Gestión de estudiantes** con búsqueda avanzada
- ✅ **Menú lateral expandible** con atajos de teclado
- ✅ **Predicciones de riesgo académico**
- ✅ **Soporte y ayuda**

## 🌐 URLs del Sistema

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend** | http://localhost:3001 | 3001 |
| **Login** | http://localhost:3000/login | 3000 |

## ⌨️ Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl + N` | Nuevo estudiante |
| `Ctrl + F` | Buscar estudiantes |
| `Ctrl + B` | Toggle menú lateral |
| `Escape` | Cerrar modal/menú |

## 🌍 Cambio de Idioma
- **En Login:** Selector en la esquina superior derecha
- **En la aplicación:** Barra de navegación superior

## 🔧 Solución de Problemas

### Error: "npm no encontrado"
```bash
# Instalar Node.js desde https://nodejs.org/
# Reiniciar terminal después de la instalación
node --version
npm --version
```

### Error: "Puerto 3000 ocupado"
```bash
# Cambiar puerto en package.json o detener otros procesos
netstat -ano | findstr :3000
```

### Error de dependencias
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

## 📱 Características del Sistema

### 🎨 Interfaz de Usuario
- Diseño responsive (móvil y escritorio)
- Tema claro con colores corporativos
- Animaciones suaves y transiciones
- Componentes accesibles (ARIA labels)

### 🔍 Gestión de Estudiantes
- Búsqueda en tiempo real
- Filtros avanzados
- Estadísticas dinámicas
- Estados de riesgo visual

### 📊 Dashboard
- Tarjetas de métricas en tiempo real
- Gráficos de rendimiento
- Bienvenida personalizada
- Navegación intuitiva

## 🆘 Soporte
Si encuentras problemas:
1. Revisa que Node.js esté instalado correctamente
2. Asegúrate de estar en la carpeta correcta
3. Verifica que los puertos no estén ocupados
4. Consulta la documentación en la carpeta `docs/`

---

**¡Listo para empezar!** 🎉

Ejecuta `inicio-rapido.bat` y comienza a usar el sistema en menos de 2 minutos.