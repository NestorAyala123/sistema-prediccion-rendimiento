# GUÍA DE USO - Sistema de Predicción de Rendimiento Académico

## 🎯 Resumen de Funcionalidades Implementadas

### Autenticación y Seguridad

- **Registro de Usuarios**: Formulario con validación de contraseñas
- **Inicio de Sesión**: Login con email y contraseña
- **Protección de Rutas**: Las rutas principales requieren autenticación
- **Token JWT**: Manejo seguro de sesiones con localStorage
- **Contexto Global**: AuthContext para estado global de usuario

### Interfaz y Usabilidad (Cognitiva)

- **Diseño Limpio**: Interfaz minimalista sin distracciones
- **Cabecera Clara**: Logo, nombre del sistema, búsqueda, selector de idioma, estado de sesión
- **Menú Lateral Expandible**: Iconos con textos, atajos de teclado
- **Botones Cortos**: "Entrar", "Salir", "Ayuda" con iconos reconocibles
- **Foco Visible**: Todos los controles interactivos con focus:ring para navegación por teclado
- **Footer**: Información institucional, enlaces a soporte y políticas
- **Mensaje de Sesión**: "Sesión iniciada correctamente" visible en cabecera
- **Responsive**: Interfaz adaptable sin scroll horizontal (320-1440 px)

### Funcionalidades de Gestión

- **Dashboard**: Resumen estadístico con tarjetas de KPIs
- **Gestión de Estudiantes**: CRUD completo, búsqueda, modal de creación
- **Predicciones**: Listado con filtros por nivel de riesgo
- **Exportación de Datos**: Botón "Exportar Datos" que descarga CSV
- **Generación de Reportes**: Botón "Generar Reporte" para predicciones individuales

## 🚀 Cómo Usar la Aplicación

### 1. Instalación Inicial

```powershell
# Backend
cd .\backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd .\frontend
npm install
npm start
```

### 2. Registro e Inicio de Sesión

**Pantalla de Registro** (`/register`):

- Ingresa Nombres, Apellidos, Email y contraseña
- La contraseña debe tener al menos 6 caracteres
- Haz clic en "Registrarse"

**Pantalla de Login** (`/login`):

- Usa el email y contraseña registrados
- En modo demo, cualquier email/contraseña es válido
- Haz clic en "Iniciar Sesión"

### 3. Navegación Principal

Tras iniciar sesión, verás:

- **Cabecera**: Logo, búsqueda, idioma (ES/EN), tu nombre, botón "Ayuda" y "Salir"
- **Menú Lateral**: Dashboard, Estudiantes, Predicciones (expandible/colapsable)
- **Cuerpo**: Contenido de la sección seleccionada
- **Pie**: Información institucional

### 4. Funciones por Sección

#### Dashboard

- Resumen de estadísticas (Total Estudiantes, Predicciones, Distribución de Riesgo)
- **Acciones Rápidas**:
  - "Generar Nueva Predicción" → Va a Predicciones
  - "Ver Reportes" → Abre panel de reportes
  - "Exportar Datos" → Descarga CSV de estudiantes

#### Estudiantes

- **Tabla**: Lista todos los estudiantes con ID, email, semestre y nivel de riesgo
- **Búsqueda**: Escribe para filtrar por nombre, email o ID
- **Agregar Estudiante**: Abre un modal con formulario
- **Acciones**: Ver Detalles, Generar Predicción, Eliminar

#### Predicciones

- **Listado**: Predicciones con nivel de riesgo, estado y factores clave
- **Filtros**: Todos, Riesgo Alto, Riesgo Medio, Riesgo Bajo
- **Acciones**:
  - "Ver Detalles": Muestra información de la predicción
  - "Generar Reporte": Descarga PDF del reporte
  - "Recalcular": Recalcula la predicción

## ⌨️ Accesibilidad y Atajos

### Navegación por Teclado

- **Tab**: Navega entre elementos interactivos
- **Enter**: Activa botones y links
- **Escape**: Cierra modales

### Atajos de Menú (implementado en Sidebar)

- **D**: Dashboard
- **E**: Estudiantes

### ARIA Labels

- Todos los inputs y botones tienen atributos aria-label para lectores de pantalla
- Campos obligatorios marcados con asterisco rojo (\*)

## 📊 Métricas de Usabilidad Implementadas

### Cuantitativas

- ✅ Tiempo de carga < 2 seg (build optimizado)
- ✅ Nº de clics ≤ 3 para acciones principales
- ✅ Interfaces sin scroll horizontal
- ✅ Campos con validación clara

### Cualitativas (Escalas Likert)

- Interfaz percibida como coherente (1-5)
- Facilidad de navegación intuitiva
- Claridad de mensajes y botones

## 🔐 Modo Demo

- Sin backend disponible, la app funciona en modo demo
- El login/registro guardan datos en localStorage
- Los datos persisten en la sesión actual
- Las operaciones de base de datos muestran mensajes informativos

## 🛠️ Troubleshooting

### El frontend no arranca

```powershell
npm install
npm start
```

### El backend no arranca (puerto 3001 en uso)

```powershell
# Cambiar puerto temporalmente
$env:PORT=3002; npm run start:dev
```

### Sesión perdida

- Los tokens se guardan en localStorage
- Si borras localStorage, deberás volver a iniciar sesión

## 📝 Notas de Desarrollo

### Estructura Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── App.tsx (rutas principales)
│   │   ├── Layout.tsx (estructura general)
│   │   ├── Navbar.tsx (cabecera)
│   │   ├── Sidebar.tsx (menú lateral)
│   │   ├── Footer.tsx (pie de página)
│   │   ├── Login.tsx (inicio de sesión)
│   │   ├── Register.tsx (registro)
│   │   ├── Dashboard.tsx (resumen)
│   │   ├── Estudiantes.tsx (gestión)
│   │   ├── Predicciones.tsx (análisis)
│   │   └── ProtectedRoute.tsx (protección)
│   ├── contexts/
│   │   └── AuthContext.tsx (estado de sesión)
│   └── services/
│       └── api.ts (llamadas HTTP)
├── package.json
└── tailwind.config.js (estilos)
```

### Variables de Entorno

- `REACT_APP_API_URL`: URL del backend (por defecto: http://localhost:3001)

## ✅ Checklist de Funcionalidades

- [x] Autenticación (Login/Register)
- [x] Rutas protegidas
- [x] Dashboard con estadísticas
- [x] CRUD de Estudiantes
- [x] Gestión de Predicciones
- [x] Exportación de datos (CSV)
- [x] Generación de reportes
- [x] Interfaz responsive
- [x] Accesibilidad (ARIA, foco, teclado)
- [x] Contexto de autenticación
- [x] Validación de formularios

## 📞 Soporte

- Centro de Ayuda: Botón "Ayuda" en la cabecera
- Email: soporte@universidad.edu
- Contacto: +593 XXXX XXXX

---

**Última actualización**: 21 de octubre de 2025  
**Versión**: 1.0.0  
**Estado**: Producción (Demo)
