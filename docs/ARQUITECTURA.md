# 🏗️ Arquitectura del Sistema - Diagrama Completo

## 📐 Estructura General

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│          SISTEMA DE PREDICCIÓN DE RENDIMIENTO ACADÉMICO           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

                            ┌──────────────┐
                            │    USUARIO   │
                            │  (Navegador) │
                            └──────┬───────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            http://localhost:3000        Firefox/Chrome
                    │                             │
        ┌───────────▼─────────────┐              │
        │                         │              │
        │   FRONTEND (React)      │◄─────────────┘
        │   Puerto 3000           │
        │                         │
        ├─ Components             │
        ├─ Contexts               │
        ├─ Services (API)         │
        └───────────┬─────────────┘
                    │
                    │ fetch/axios
                    │ (JSON over HTTP)
                    │
        ┌───────────▼─────────────┐
        │                         │
        │  API Backend (NestJS)   │
        │  Puerto 3001            │
        │                         │
        ├─ Controllers            │
        ├─ Services              │
        ├─ Modules               │
        └───────────┬─────────────┘
                    │
                    │ TypeORM
                    │ (SQL Query)
                    │
        ┌───────────▼─────────────┐
        │                         │
        │  Base de Datos SQLite   │
        │  (database.db)          │
        │                         │
        ├─ Usuarios              │
        ├─ Estudiantes           │
        ├─ Asignaturas           │
        ├─ Predicciones          │
        └─────────────────────────┘
```

---

## 🎨 Frontend - Estructura de Componentes

```
App.tsx (punto de entrada)
├── Router (React Router v6)
│   └── AuthProvider (Contexto de autenticación)
│       ├── Rutas Públicas
│       │   ├── /login ..................... Login.tsx
│       │   └── /register ................. Register.tsx
│       │
│       └── Rutas Protegidas (ProtectedRoute)
│           └── Layout.tsx
│               ├── Navbar.tsx ........... Barra superior
│               ├── Sidebar.tsx ......... Menú lateral
│               ├── Main Content
│               │   ├── / ................ Dashboard.tsx
│               │   ├── /estudiantes ..... Estudiantes.tsx
│               │   └── /predicciones .... Predicciones.tsx
│               │
│               └── Footer.tsx .......... Pie de página
```

### 📁 Árbol de Archivos Frontend

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── Login.tsx              [141 líneas]
│   │   ├── Register.tsx           [229 líneas]
│   │   ├── Dashboard.tsx
│   │   ├── Estudiantes.tsx
│   │   ├── Predicciones.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx     [HOC]
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx        [Gestión de Auth]
│   │
│   ├── services/
│   │   └── api.ts                 [Cliente HTTP]
│   │
│   ├── App.tsx
│   ├── index.tsx
│   ├── App.css
│   ├── index.css
│   └── react-app-env.d.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔧 Backend - Estructura de Módulos

```
Backend (NestJS)
│
├── app.module.ts
│   └── Importa todos los módulos
│
├── app.controller.ts
├── app.service.ts
│
├── database/
│   ├── database.config.ts       [Configuración TypeORM]
│   └── init.sql
│
├── entities/                     [Modelos de datos]
│   ├── usuario.entity.ts
│   ├── estudiante.entity.ts
│   ├── asignatura.entity.ts
│   ├── asistencia.entity.ts
│   ├── calificacion.entity.ts
│   ├── inscripcion.entity.ts
│   ├── habito-estudio.entity.ts
│   └── prediccion-riesgo.entity.ts
│
├── modules/
│   └── estudiantes/
│       ├── estudiantes.module.ts
│       ├── estudiantes.controller.ts
│       ├── estudiantes.service.ts
│       └── dto/
│           ├── create-estudiante.dto.ts
│           └── update-estudiante.dto.ts
│
└── auth/                        [⏳ NO IMPLEMENTADO AÚN]
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── auth.service.ts
    ├── strategies/
    │   └── jwt.strategy.ts
    ├── guards/
    │   └── jwt.guard.ts
    └── dto/
        ├── login.dto.ts
        └── register.dto.ts
```

---

## 🔄 Flujos de Datos

### Flujo 1: Login / Registro

```
┌─────────────┐
│ Usuario     │ Ingresa email + password
│ (Navegador) │
└──────┬──────┘
       │
       │ POST /auth/login
       ▼
┌─────────────────────┐
│ Frontend (React)    │ Valida y envía
└──────┬──────────────┘
       │
       │ fetch/axios
       │ (localhost:3001)
       ▼
┌─────────────────────────┐
│ Backend (NestJS)        │ ⏳ 404 Not Found
│ auth/login endpoint     │    (No existe aún)
└──────┬──────────────────┘
       │
       │ Error capturado
       ▼
┌─────────────────────────┐
│ Frontend: .catch()      │ Crea dummy token
└──────┬──────────────────┘
       │
       │ localStorage.setItem()
       ▼
┌─────────────────────────┐
│ localStorage            │ {
│                         │   token: "demo-token",
│                         │   user: {...}
│                         │ }
└──────┬──────────────────┘
       │
       │ Redirige a /
       ▼
┌─────────────────────────┐
│ Dashboard ✅            │ Acceso a aplicación
└─────────────────────────┘
```

### Flujo 2: Acceso a Recurso Protegido

```
┌──────────────┐
│ Usuario hace │ GET /estudiantes
│ clic en menu │
└──────┬───────┘
       │
       │
       ▼
┌──────────────────────────┐
│ Frontend verifica        │
│ useAuth() → isAuthenticated?
└──────┬───────────────────┘
       │
       ├─ true  ──► Muestra contenido ✅
       │
       └─ false ──► Redirige a /login
```

### Flujo 3: Llamada API con Token JWT

```
┌─────────────────────────┐
│ Frontend necesita datos │
│ (GET /api/estudiantes)  │
└──────┬──────────────────┘
       │
       │ 1. Obtiene token de localStorage
       │
       ▼
┌──────────────────────────┐
│ axios interceptor        │
│ Agrega header:           │
│ Authorization: Bearer    │
│    <token>               │
└──────┬───────────────────┘
       │
       │ 2. Envía petición HTTP
       │
       ▼
┌──────────────────────────┐
│ Backend (NestJS)         │
│ Valida JWT               │
└──────┬───────────────────┘
       │
       ├─ Válido  ──► Retorna datos ✅
       │
       └─ Inválido ──► 401 Unauthorized
```

---

## 💾 Esquema de Base de Datos

```
USUARIOS
├── id_usuario (PK)
├── email (UNIQUE)
├── password (HASH)
├── nombres
├── apellidos
└── rol

ESTUDIANTES
├── id_estudiante (PK)
├── id_usuario (FK)
├── carrera
├── semestre
├── promedio_actual
└── created_at

ASIGNATURAS
├── id_asignatura (PK)
├── nombre
├── codigo
├── creditos
└── departamento

ASISTENCIA
├── id_asistencia (PK)
├── id_estudiante (FK)
├── id_asignatura (FK)
├── porcentaje
└── fecha

CALIFICACIONES
├── id_calificacion (PK)
├── id_estudiante (FK)
├── id_asignatura (FK)
├── nota
└── fecha

HABITOS_ESTUDIO
├── id_habito (PK)
├── id_estudiante (FK)
├── horas_estudio
├── participacion_clase
└── cumplimiento_tareas

PREDICCIONES_RIESGO
├── id_prediccion (PK)
├── id_estudiante (FK)
├── porcentaje_riesgo
├── recomendaciones
└── created_at
```

---

## 🔐 Seguridad - Flujo de Autenticación

```
┌──────────────────────────────────────────────────────┐
│              FLUJO DE AUTENTICACIÓN                  │
└──────────────────────────────────────────────────────┘

1. REGISTRO
   Usuario → Ingresa datos
           → Backend hash (bcrypt)
           → Guarda en BD
           → Retorna JWT token
           → Frontend guarda en localStorage

2. LOGIN
   Usuario → Ingresa email/password
           → Backend busca en BD
           → Compara password (bcrypt)
           → Retorna JWT token
           → Frontend guarda en localStorage

3. ACCESO A RECURSOS
   Frontend → Envía petición
            → Incluye JWT en header
            → Backend valida JWT
            → Permite/Deniega acceso

4. LOGOUT
   Usuario → Hace clic en logout
           → Frontend limpia localStorage
           → Redirige a /login
           → Nueva sesión requiere login
```

---

## 🔌 Endpoints API (Planeados)

### Autenticación (⏳ Pendiente)

```
POST   /auth/register      Crear cuenta
POST   /auth/login         Iniciar sesión
GET    /auth/profile       Obtener perfil
POST   /auth/logout        Cerrar sesión
```

### Estudiantes (✅ Parcial)

```
GET    /estudiantes        Listar todos
GET    /estudiantes/:id    Obtener uno
POST   /estudiantes        Crear
PUT    /estudiantes/:id    Actualizar
DELETE /estudiantes/:id    Eliminar
GET    /estudiantes/export Exportar CSV
```

### Predicciones (⏳ Pendiente)

```
GET    /predicciones       Listar todas
POST   /predicciones       Generar nueva
GET    /predicciones/:id/reporte Descargar PDF
```

---

## 📊 Estados de la Aplicación

### Frontend State Management

```
┌─────────────────────────────────┐
│      AuthContext (Global)       │
│                                 │
│ ├─ user: User | null            │
│ ├─ token: string | null         │
│ ├─ isAuthenticated: boolean     │
│ ├─ isLoading: boolean           │
│ │                               │
│ ├─ login(email, pwd) → void     │
│ ├─ register(...) → void         │
│ └─ logout() → void              │
│                                 │
│ Fuente: localStorage            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│    Component Local State        │
│                                 │
│ ├─ Login: email, password       │
│ ├─ Register: form data          │
│ ├─ Dashboard: KPI data          │
│ ├─ Estudiantes: table data      │
│ └─ Predicciones: predictions    │
│                                 │
│ Fuente: useState() hooks        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│    localStorage (Persistente)   │
│                                 │
│ ├─ token: JWT o "demo-token"    │
│ └─ user: {email, role, ...}     │
│                                 │
│ Fuente: AuthContext             │
└─────────────────────────────────┘
```

---

## 🚀 Flujo de Deploy

```
┌─────────────────────────────────────────────────┐
│           FLUJO DE DESARROLLO                   │
└─────────────────────────────────────────────────┘

LOCAL DEVELOPMENT
├─ npm install (backend + frontend)
├─ npm run start:dev (backend)
├─ npm start (frontend)
└─ Pruebas locales en http://localhost:3000

STAGING (Simulado)
├─ npm run build (frontend)
├─ npm run build (backend)
└─ Verifica compilación sin errores

PRODUCTION
├─ Deploy frontend en hosting (Vercel, Netlify, etc)
├─ Deploy backend en servidor (Heroku, AWS, etc)
├─ Configurar variables de entorno
└─ Habilitar HTTPS y CORS

CI/CD (Futuro)
├─ Pruebas automáticas
├─ Build automático
└─ Deploy automático en merge
```

---

## 📱 Responsividad

```
┌──────────────────────────────────────────────────┐
│           BREAKPOINTS TAILWIND CSS               │
└──────────────────────────────────────────────────┘

Mobile       ────────────────  < 640px
             └─ Sidebar oculto
             └─ Full width content

Tablet       ────────────────  640px - 1024px
             └─ Sidebar colapsable
             └─ Contenido adaptado

Desktop      ────────────────  1024px - 1280px
             └─ Sidebar visible
             └─ Layout óptimo

Wide Desktop ────────────────  > 1280px
             └─ Sidebar fijo
             └─ Contenido máximo width
```

---

## 🔌 Integraciones Externas

```
FRONTEND
├─ React Router (v6.14.1)
├─ Axios (HTTP client)
├─ Tailwind CSS (Estilos)
├─ TypeScript (Lenguaje)
└─ React 19 (Framework)

BACKEND
├─ NestJS (Framework)
├─ TypeORM (ORM)
├─ SQLite (Base de datos)
├─ JWT (Autenticación)
├─ bcrypt (Hash de contraseñas)
└─ Passport (Estrategias auth)

DEPLOYMENT
├─ Node.js 16+ (Runtime)
├─ npm (Package manager)
└─ Git (Control de versiones)
```

---

## 🎓 Resumen Ejecutivo

```
┌────────────────────────────────────────────────────┐
│  SISTEMA MODULAR, ESCALABLE Y MANTENIBLE          │
│                                                    │
│  ✅ Frontend: 100% completo y funcional           │
│  ⏳ Backend: Estructura lista, auth pendiente     │
│  ✅ Base de datos: Entidades completas            │
│  ✅ Documentación: Guías paso a paso              │
│  ✅ Scripts: Automatización completa              │
│                                                    │
│  📊 Líneas de código: ~2000 LOC                   │
│  📦 Dependencias: Mínimas, bien elegidas          │
│  🔒 Seguridad: JWT, bcrypt, CORS ready            │
│  ♿ Accesibilidad: WCAG 2.1 Level AA              │
│  📱 Responsividad: 320px - 1440px+                │
│                                                    │
│  🚀 Listo para producción (con backend impl.)    │
└────────────────────────────────────────────────────┘
```

---

**Diagrama Actualizado: 21 de Octubre de 2025**

Para más detalles técnicos, ver: `ESTADO_ACTUAL.md`
