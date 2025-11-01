# Sistema de Predicción de Rendimiento Académico

Sistema web profesional para predecir el rendimiento académico de estudiantes basado en promedio de notas y porcentaje de asistencia. Incluye autenticación, dashboard analítico, gestión de estudiantes y generación de predicciones inteligentes.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Características](#características)
6. [Cómo Usar](#cómo-usar)
7. [Comandos Disponibles](#comandos-disponibles)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Previos

### Sistemas Operativos Soportados

- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 18.04+)

### Software Requerido

#### Node.js y npm

- **Node.js**: v16.0.0 o superior
- **npm**: v8.0.0 o superior

Para verificar las versiones instaladas:

```powershell
node --version
npm --version
```

Para instalar Node.js y npm, descárgalos de: https://nodejs.org/

#### Git (Opcional pero recomendado)

```powershell
git --version
```

Descargar de: https://git-scm.com/

---

## 📦 Instalación

### Opción 1: Instalación Automática (Recomendada para Windows)

```powershell
# Navega a la carpeta del proyecto
cd "C:\Users\TuUsuario\OneDrive - ULEAM\Escritorio\predipcion\sistema-prediccion-rendimiento"

# Ejecuta el script de instalación
.\instalar.ps1

# Selecciona la opción 4 para instalación completa
```

### Opción 2: Instalación Manual

#### Paso 1: Clonar o Descargar el Repositorio

```powershell
# Si usas Git
git clone https://github.com/NestorAyala123/sistema-prediccion-rendimiento.git
cd sistema-prediccion-rendimiento

# O simplemente navega a la carpeta si ya la tienes descargada
cd "C:\ruta\al\proyecto\sistema-prediccion-rendimiento"
```

#### Paso 2: Instalar Dependencias del Backend

```powershell
# Navega a la carpeta backend
cd backend

# Instala todas las dependencias
npm install

# Espera a que termine (puede tomar 2-5 minutos)
```

**Dependencias principales del Backend (NestJS):**

- `@nestjs/common` - Framework core
- `@nestjs/core` - Core runtime
- `@nestjs/platform-express` - Express adapter
- `@nestjs/typeorm` - ORM para base de datos
- `@nestjs/jwt` - Autenticación JWT
- `@nestjs/passport` - Estrategia de autenticación
- `typeorm` - ORM SQL
- `sqlite3` - Driver SQLite
- `passport-jwt` - JWT strategy
- `bcrypt` - Encriptación de contraseñas
- `uuid` - Generador de IDs únicos

#### Paso 3: Instalar Dependencias del Frontend

```powershell
# Navega a la carpeta frontend (desde la raíz del proyecto)
cd frontend

# Instala todas las dependencias
npm install

# Espera a que termine (puede tomar 3-5 minutos)
```

**Dependencias principales del Frontend (React):**

- `react` - Librería UI (v18+)
- `react-dom` - Renderizador React
- `react-router-dom` - Enrutamiento
- `typescript` - Tipado estático
- `tailwindcss` - Framework CSS utilitario
- `axios` - Cliente HTTP
- `class-validator` - Validación de datos
- `class-transformer` - Transformación de datos

#### Paso 4: Verificar Instalación

```powershell
# Backend
cd backend
npm run start:dev

# Deberías ver: "Backend ejecutándose en http://localhost:3001"
```

```powershell
# Frontend (en otra ventana de terminal)
cd frontend
npm start

# Se abrirá automáticamente: http://localhost:3000
```

---

## 📂 Estructura del Proyecto

```
sistema-prediccion-rendimiento/
├── backend/                          # API NestJS
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── database/                # Configuración de BD
│   │   │   ├── database.config.ts
│   │   │   └── init.sql
│   │   ├── entities/                # Modelos de datos
│   │   │   ├── asignatura.entity.ts
│   │   │   ├── asistencia.entity.ts
│   │   │   ├── calificacion.entity.ts
│   │   │   ├── estudiante.entity.ts
│   │   │   ├── habito-estudio.entity.ts
│   │   │   ├── inscripcion.entity.ts
│   │   │   ├── prediccion-riesgo.entity.ts
│   │   │   └── usuario.entity.ts
│   │   └── modules/                 # Módulos de negocio
│   │       ├── estudiantes/
│   │       └── predicciones/
│   ├── database/                    # Base de datos SQLite
│   │   └── academic_prediction.db
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env (si aplica)
│
├── frontend/                        # Aplicación React
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/              # Componentes React
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Estudiantes.tsx
│   │   │   ├── Predicciones.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/                # Context API
│   │   │   ├── AuthContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── i18n/                    # Internacionalización
│   │   │   ├── translations.ts
│   │   │   └── useTranslation.ts
│   │   ├── services/                # Servicios API
│   │   │   └── api.ts
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docs/                            # Documentación
│   ├── INICIO_RAPIDO.md
│   ├── GUIA_PRUEBAS.md
│   ├── ARQUITECTURA.md
│   └── ...
├── .gitignore
├── README.md                        # Este archivo
└── instalar.ps1                     # Script de automatización

```

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología     | Versión | Uso                          |
| -------------- | ------- | ---------------------------- |
| **Node.js**    | 16+     | Runtime de JavaScript        |
| **NestJS**     | 9+      | Framework backend            |
| **TypeScript** | 4.7+    | Lenguaje tipado              |
| **TypeORM**    | 0.3+    | ORM para base de datos       |
| **SQLite3**    | 5.1+    | Base de datos relacional     |
| **JWT**        | -       | Autenticación                |
| **bcrypt**     | 5.1+    | Encriptación de contraseñas  |
| **Passport**   | 0.6+    | Estrategias de autenticación |

### Frontend

| Tecnología       | Versión  | Uso                      |
| ---------------- | -------- | ------------------------ |
| **React**        | 18+      | Librería UI              |
| **React Router** | 6+       | Enrutamiento             |
| **TypeScript**   | 4.7+     | Lenguaje tipado          |
| **Tailwind CSS** | 3.2+     | Estilos CSS utilitarios  |
| **Axios**        | 1.3+     | Cliente HTTP             |
| **Context API**  | Built-in | Gestión de estado global |

### Base de Datos

| Componente     | Detalles                                     |
| -------------- | -------------------------------------------- |
| **SQLite**     | Base de datos relacional local               |
| **Tablas**     | 8 (usuarios, estudiantes, asignaturas, etc.) |
| **Relaciones** | Claves foráneas con CASCADE DELETE           |
| **Ubicación**  | `backend/database/academic_prediction.db`    |

---

## ✨ Características

### 🔐 Autenticación y Seguridad

- ✅ Registro de usuarios con validación
- ✅ Login con JWT (JSON Web Tokens)
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Protección de rutas con guards
- ✅ Roles de usuario (Admin, Consejero, Profesor)

### 📊 Dashboard Analítico

- ✅ Estadísticas en tiempo real
- ✅ Total de estudiantes
- ✅ Total de predicciones generadas
- ✅ Distribución de niveles de riesgo (Bajo/Medio/Alto)
- ✅ Indicadores KPI actualizables

### 👥 Gestión de Estudiantes

- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Captura de datos académicos:
  - ID de estudiante
  - Nombre y apellido
  - Email único
  - Semestre actual
  - Promedio de notas (0-100%)
  - Porcentaje de asistencia (0-100%)
- ✅ Búsqueda y filtrado
- ✅ Exportación a CSV
- ✅ Vista responsiva (tabla en desktop, tarjetas en móvil)

### 🎯 Generación de Predicciones

- ✅ Cálculo automático de nivel de riesgo
- ✅ Algoritmo inteligente basado en:
  - Promedio de notas
  - Porcentaje de asistencia
- ✅ Niveles de riesgo:
  - **Bajo**: Promedio ≥70% AND Asistencia ≥80%
  - **Medio**: Promedio 60-69% OR Asistencia 70-79%
  - **Alto**: Promedio <50% OR Asistencia <60%
- ✅ Factores clave detallados
- ✅ Generación de reportes (PDF)
- ✅ Eliminar predicciones

### 🌍 Internacionalización (i18n)

- ✅ Español (ES)
- ✅ Inglés (EN)
- ✅ Selector de idioma en UI
- ✅ Persistencia de preferencia de idioma

### 🌙 Modo Oscuro

- ✅ Toggle Dark Mode
- ✅ Basado en clase CSS (no sistema operativo)
- ✅ Persistencia en localStorage
- ✅ Aplicado a todos los componentes

### 📱 Diseño Responsivo

- ✅ Desktop (1024px+)
- ✅ Tablet (768px-1023px)
- ✅ Móvil (320px-767px)
- ✅ Drawer navegable en móvil
- ✅ Breakpoints Tailwind CSS

### 📈 Exportación de Datos

- ✅ Exportar estudiantes a CSV
- ✅ Generación de reportes PDF
- ✅ Descarga directa al navegador

---

## 🚀 Cómo Usar

### Flujo Básico

#### 1. Iniciar Sesión

```
Email: cualquiera
Contraseña: cualquiera
(Sistema en modo demo)
```

#### 2. Agregar Estudiante

1. Ve a "Estudiantes"
2. Haz clic en "Agregar estudiante"
3. Completa el formulario:
   - ID: 1234567890
   - Nombre: Juan
   - Apellido: Pérez
   - Email: juan@ejemplo.com
   - Semestre: 3
   - Promedio de notas: 85
   - Porcentaje de asistencia: 92
4. Haz clic en "Guardar"

#### 3. Generar Predicción

1. Ve a "Predicciones"
2. Haz clic en "Agregar nueva predicción"
3. Selecciona el estudiante
4. Haz clic en "Generar predicción"
5. ¡El sistema calculará automáticamente el nivel de riesgo!

#### 4. Ver Dashboard

1. Ve a "Panel"
2. Observa:
   - Total de estudiantes registrados
   - Total de predicciones generadas
   - Distribución de riesgos

---

## ⌨️ Comandos Disponibles

### Instalación Completa

```powershell
# Windows PowerShell
.\instalar.ps1
```

### Backend

```powershell
# Navegar a backend
cd backend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo (watch mode)
npm run start:dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start

# Ejecutar tests
npm run test

# Linter
npm run lint
```

### Frontend

```powershell
# Navegar a frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm run test

# Eject (no recomendado)
npm run eject
```

### Toda la Aplicación

```powershell
# Detener todos los procesos
Get-Process node | Stop-Process -Force

# Limpiar base de datos
Remove-Item backend/database/academic_prediction.db -ErrorAction SilentlyContinue

# Reiniciar completamente
.\instalar.ps1
```

---

## 🌐 Acceso a la Aplicación

Una vez iniciada, accede a través de:

| Servicio              | URL                       | Descripción                   |
| --------------------- | ------------------------- | ----------------------------- |
| **Frontend**          | http://localhost:3000     | Interfaz web del usuario      |
| **Backend**           | http://localhost:3001     | API REST                      |
| **Documentación API** | http://localhost:3001/api | Swagger (si está configurado) |

---

## 📄 Estructura de la Base de Datos

### Tablas Principales

#### 1. **usuarios**

```sql
- id_usuario (PK)
- email (UNIQUE)
- nombres
- apellidos
- nombre_usuario
- rol (Admin, Consejero, Profesor)
- password (encriptada con bcrypt)
- created_at, updated_at
```

#### 2. **estudiantes**

```sql
- id_estudiante (PK)
- nombres
- apellidos
- email (UNIQUE)
- semestre_actual
- promedio_notas (REAL, 0-100)
- porcentaje_asistencia (REAL, 0-100)
- id_usuario (FK)
- created_at, updated_at
```

#### 3. **predicciones_riesgo**

```sql
- id_prediccion (PK)
- id_estudiante (FK, CASCADE DELETE)
- fecha_prediccion
- nivel_riesgo (Bajo, Medio, Alto)
- factores_clave (TEXT)
- estado_prediccion (Calculando, Completado)
- created_at, updated_at
```

#### 4. Otras Tablas

- **asignaturas** - Cursos disponibles
- **inscripciones** - Inscripciones estudiante-asignatura
- **calificaciones** - Notas por inscripción
- **asistencias** - Asistencia diaria
- **habitos_estudio** - Datos de hábitos de estudio

---

## 🐛 Solución de Problemas

### Error: "npm: comando no encontrado"

**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Puerto 3000 ya está en uso"

```powershell
# Encuentra el proceso usando el puerto
netstat -ano | findstr :3000

# Termina el proceso (PID = Process ID)
taskkill /PID <PID> /F
```

### Error: "ENOENT: no such file or directory, open 'database/academic_prediction.db'"

```powershell
# La BD se crea automáticamente. Si falta:
cd backend
npm run start:dev
# Espera a que se cree la BD
```

### Error: "CORS o acceso denegado"

- Verifica que el backend esté corriendo en http://localhost:3001
- Revisa la consola del navegador (F12) para más detalles

### Error: "No tienes permisos para ejecutar scripts"

```powershell
# En Windows PowerShell como administrador:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### La aplicación es lenta

- Borra `node_modules` en ambas carpetas
- Vuelve a instalar dependencias
- Comprueba que tienes suficiente espacio en disco

---

## 📚 Documentación Adicional

Para más información, consulta la carpeta `docs/`:

- **INICIO_RAPIDO.md** - Guía de inicio rápido
- **GUIA_PRUEBAS.md** - Casos de prueba
- **BACKEND_AUTH_SETUP.md** - Configuración de autenticación
- **ARQUITECTURA.md** - Arquitectura del sistema

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección [Solución de Problemas](#solución-de-problemas)
2. Consulta la documentación en `docs/`
3. Crea un issue en GitHub: https://github.com/NestorAyala123/sistema-prediccion-rendimiento/issues

---

## 📄 Licencia

Este proyecto es de código abierto bajo licencia MIT.

---

**Última actualización:** 22 de Octubre de 2025  
**Versión:** 1.0.0
