# 🎓 Sistema de Predicción de Rendimiento Académico

Sistema completo de predicción y gestión académica con interfaz moderna y funcionalidades de accesibilidad.

## ✨ Características Principales

- 📊 **Dashboard** con estadísticas en tiempo real
- 👥 **Gestión de Estudiantes** con búsqueda avanzada
- 🔮 **Predicciones de Riesgo** con análisis detallado
- 🔍 **Búsqueda Global** inteligente
- 🎨 **Colores Personalizados** con 6 paletas predefinidas
- ♿ **Accesibilidad Completa** (WCAG 2.1)
- 🌐 **Multiidioma** (Español/Inglés)
- 💾 **Almacenamiento Local** (funciona sin backend)

## 🚀 Inicio Rápido

### Opción 1: Archivo Batch (Recomendado)

1. Haz doble clic en `INICIAR.bat`
2. Espera a que se abra el navegador automáticamente
3. Usa las credenciales de demo (cualquier email/password)

### Opción 2: Manual

```bash
cd frontend
npm install
npm start
```

El sistema se abrirá en `http://localhost:3000`

## 📋 Requisitos

- **Node.js** 14.x o superior
- **npm** 6.x o superior
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## 🎯 Funcionalidades Implementadas

### 1. Gestión de Estudiantes
- ✅ Agregar nuevos estudiantes
- ✅ Búsqueda por nombre, email o ID
- ✅ Visualización de datos académicos
- ✅ Estadísticas en tiempo real
- ✅ Exportación de datos

### 2. Predicciones
- ✅ Crear nuevas predicciones
- ✅ Cálculo automático de nivel de riesgo
- ✅ Identificación de factores clave
- ✅ Filtrado por nivel de riesgo
- ✅ Generación de reportes

### 3. Búsqueda Global
- ✅ Búsqueda desde el navbar
- ✅ Navegación inteligente
- ✅ Detección de palabras clave
- ✅ Filtrado contextual

### 4. Accesibilidad
- ✅ 6 paletas de colores predefinidas
- ✅ Personalización completa de colores
- ✅ Tamaño de texto ajustable
- ✅ Alto contraste
- ✅ Modo oscuro
- ✅ Lectura por voz
- ✅ Navegación por teclado
- ✅ Control por voz

### 5. Interfaz de Usuario
- ✅ Diseño responsivo
- ✅ Sidebar expandible
- ✅ Atajos de teclado
- ✅ Notificaciones visuales
- ✅ Modales interactivos

## 🎨 Paletas de Colores Disponibles

1. **Default** - Azul/Blanco clásico
2. **Oscuro** - Para ambientes con poca luz
3. **Cálido** - Tonos ámbar que reducen fatiga visual
4. **Natura** - Verdes relajantes
5. **Alto Contraste** - Negro/Amarillo para baja visión
6. **Rosa** - Tonos rosados/púrpura

Ver `docs/COLORES_PERSONALIZADOS.md` para más detalles.

## 🔑 Credenciales de Demo

```
Email: cualquier@email.com
Password: cualquier contraseña
```

El sistema acepta cualquier combinación de email/password en modo demo.

## 📁 Estructura del Proyecto

```
sistema-prediccion-rendimiento/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes de UI
│   │   ├── contexts/     # Contextos globales
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # Servicios API
│   │   └── styles/       # Estilos CSS
│   └── public/           # Archivos estáticos
├── docs/                 # Documentación
│   ├── COLORES_PERSONALIZADOS.md
│   ├── COLORES_IMPLEMENTACION.md
│   └── demo-paletas-colores.html
└── INICIAR.bat          # Inicio rápido
```

## 🛠️ Tecnologías Utilizadas

- **React 19.2.0** - Framework frontend
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Router 6** - Navegación
- **Heroicons** - Iconografía
- **Axios** - Cliente HTTP
- **LocalStorage** - Persistencia de datos

## 💾 Almacenamiento de Datos

El sistema usa `localStorage` para guardar:
- Estudiantes registrados
- Predicciones creadas
- Configuración de accesibilidad
- Preferencias de idioma

Los datos persisten entre sesiones y se pueden limpiar desde:
1. DevTools (F12) → Application → Local Storage
2. O ejecutando: `localStorage.clear()`

## 🌐 Internacionalización

El sistema soporta:
- 🇪🇸 Español (por defecto)
- 🇬🇧 Inglés

Cambia el idioma desde el selector en el navbar.

## ♿ Accesibilidad

### Atajos de Teclado
- `Ctrl + N` - Nuevo estudiante
- `Ctrl + F` - Buscar
- `Ctrl + B` - Vista de lista
- `Escape` - Cerrar modales
- `Alt + A` - Abrir menú de accesibilidad

### Navegación
- `Tab` - Navegar entre elementos
- `Enter` - Activar botones/enlaces
- `Space` - Seleccionar checkboxes

## 🐛 Solución de Problemas

### El navegador no se abre automáticamente
- Abre manualmente: `http://localhost:3000`

### Error "puerto 3000 en uso"
```bash
# Windows
taskkill /F /IM node.exe
# O ejecuta: stop-all.ps1
```

### Dependencias no se instalan
```bash
cd frontend
npm install --legacy-peer-deps
```

### Datos no se guardan
- Verifica que el navegador permita localStorage
- Limpia la caché: `localStorage.clear()`
- Recarga la página: `Ctrl + F5`

### Problemas de permisos (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📚 Documentación Adicional

- [Guía de Colores Personalizados](docs/COLORES_PERSONALIZADOS.md)
- [Implementación de Colores](docs/COLORES_IMPLEMENTACION.md)
- [Demo Visual de Paletas](docs/demo-paletas-colores.html)

## 🔄 Actualizaciones Recientes

### Versión 2.0 (Diciembre 2025)
- ✅ Búsqueda global implementada
- ✅ Sistema de colores personalizados mejorado
- ✅ Registro de predicciones funcional
- ✅ Almacenamiento local completo
- ✅ Eliminación de carpetas duplicadas
- ✅ Optimización de scripts de inicio
- ✅ Mejoras en accesibilidad

## 🤝 Contribución

Este es un proyecto educativo. Las sugerencias y mejoras son bienvenidas.

## 📝 Licencia

Este proyecto es de uso educativo.

## 👥 Autores

- Sistema de Predicción Académica - Equipo de Desarrollo

---

**¿Necesitas ayuda?** Revisa la documentación en la carpeta `docs/` o abre un issue.

**🚀 ¡Disfruta del sistema!**
