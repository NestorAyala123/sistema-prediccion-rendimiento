# Sistema de Roles

## 🎭 Roles del Sistema

El sistema tiene **2 tipos de roles** para usuarios administrativos:

### 1. **admin** (Administrador)
- Acceso completo al sistema
- Gestión de usuarios (crear docentes)
- Gestión de estudiantes
- Gestión de asignaturas
- Registro de calificaciones y asistencia
- Visualización de predicciones
- Acceso a auditoría

**Permisos:**
- ✅ Crear/Editar/Eliminar estudiantes
- ✅ Crear/Editar/Eliminar asignaturas
- ✅ Crear/Editar/Eliminar docentes
- ✅ Registrar calificaciones
- ✅ Registrar asistencia
- ✅ Ver predicciones
- ✅ Ver auditoría completa
- ✅ Gestionar inscripciones

### 2. **docente** (Profesor)
- Gestión de estudiantes de sus materias
- Registro de calificaciones
- Control de asistencia
- Visualización de predicciones

**Permisos:**
- ✅ Ver estudiantes
- ❌ Crear/Eliminar estudiantes (solo editar)
- ❌ Gestionar asignaturas
- ✅ Registrar calificaciones
- ✅ Registrar asistencia
- ✅ Ver predicciones
- ❌ Gestionar usuarios
- ✅ Gestionar inscripciones de sus materias

---

## 👨‍🎓 Estudiantes

Los **estudiantes NO son usuarios del sistema administrativo**. Se gestionan de forma independiente:

### Características:
- ✅ Colección separada en MongoDB (`estudiantes`)
- ✅ No tienen credenciales de acceso al sistema administrativo
- ✅ Se registran mediante una interfaz específica
- ✅ Son gestionados por admins y docentes
- ✅ Tienen su propia estructura de datos

### Campos de Estudiante:
```javascript
{
  id_estudiante: String,      // Cédula o ID único
  nombres: String,
  apellidos: String,
  email: String,
  telefono: String,
  semestre_actual: Number,
  carrera: String,
  promedio_general: Number,
  activo: Boolean
}
```

---

## 🔐 Autenticación

### Usuarios del Sistema (admin y docente)
```
POST /auth/login
{
  "email": "admin@universidad.edu",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": "admin-001",
    "nombre_usuario": "Administrador Principal",
    "rol": "admin",
    "email": "admin@universidad.edu"
  }
}
```

### Estudiantes
Los estudiantes **NO se autentican** en el sistema administrativo. Son datos gestionados por los usuarios admin y docente.

---

## 📊 Estructura de Permisos

### Endpoints por Rol

#### Estudiantes
```
GET    /estudiantes              ✅ admin  ✅ docente
GET    /estudiantes/:id          ✅ admin  ✅ docente
POST   /estudiantes              ✅ admin  ❌ docente
PUT    /estudiantes/:id          ✅ admin  ⚠️ docente (limitado)
DELETE /estudiantes/:id          ✅ admin  ❌ docente
```

#### Asignaturas
```
GET    /asignaturas              ✅ admin  ✅ docente
GET    /asignaturas/:id          ✅ admin  ✅ docente
POST   /asignaturas              ✅ admin  ❌ docente
PUT    /asignaturas/:id          ✅ admin  ❌ docente
DELETE /asignaturas/:id          ✅ admin  ❌ docente
```

#### Inscripciones
```
GET    /inscripciones            ✅ admin  ✅ docente
POST   /inscripciones            ✅ admin  ✅ docente
PUT    /inscripciones/:id        ✅ admin  ✅ docente
DELETE /inscripciones/:id        ✅ admin  ❌ docente
```

#### Calificaciones
```
GET    /calificaciones           ✅ admin  ✅ docente
POST   /calificaciones           ✅ admin  ✅ docente
PUT    /calificaciones/:id       ✅ admin  ✅ docente
DELETE /calificaciones/:id       ✅ admin  ⚠️ docente (solo sus registros)
```

#### Asistencias
```
GET    /asistencias              ✅ admin  ✅ docente
POST   /asistencias              ✅ admin  ✅ docente
PUT    /asistencias/:id          ✅ admin  ✅ docente
DELETE /asistencias/:id          ✅ admin  ⚠️ docente (solo sus registros)
```

#### Predicciones
```
GET    /predicciones             ✅ admin  ✅ docente
POST   /predicciones/calcular    ✅ admin  ✅ docente
```

#### Usuarios
```
GET    /usuarios                 ✅ admin  ❌ docente
POST   /usuarios                 ✅ admin  ❌ docente
PUT    /usuarios/:id             ✅ admin  ⚠️ docente (solo su perfil)
DELETE /usuarios/:id             ✅ admin  ❌ docente
```

#### Auditoría
```
GET    /auditoria                ✅ admin  ❌ docente
GET    /auditoria/usuario/:id    ✅ admin  ⚠️ docente (solo sus logs)
```

---

## 🛡️ Implementación de Guards

### JwtAuthGuard
Valida que el usuario esté autenticado con un token JWT válido.

```typescript
@Controller('estudiantes')
@UseGuards(JwtAuthGuard)
export class EstudiantesController {
  // Todos los endpoints requieren autenticación
}
```

### RolesGuard
Valida que el usuario tenga el rol necesario.

```typescript
@Post()
@Roles('admin')  // Solo admin
async create() { }

@Get()
@Roles('admin', 'docente')  // Admin o docente
async findAll() { }
```

---

## 📝 Ejemplos de Uso

### Crear un docente (solo admin)
```bash
POST /usuarios
Authorization: Bearer <admin_token>

{
  "id_usuario": "docente-003",
  "nombre_usuario": "Ana Martínez",
  "rol": "docente",
  "email": "ana.martinez@universidad.edu",
  "password": "password123"
}
```

### Registrar un estudiante (admin o docente)
```bash
POST /estudiantes
Authorization: Bearer <token>

{
  "id_estudiante": "1234567890",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juan.perez@universidad.edu",
  "semestre_actual": 3,
  "carrera": "Ingeniería en Sistemas"
}
```

### Registrar calificación (admin o docente)
```bash
POST /calificaciones
Authorization: Bearer <token>

{
  "id_estudiante": "1234567890",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01",
  "tipo_evaluacion": "Parcial 1",
  "nota": 8.5
}
```

---

## 🔄 Flujo de Trabajo

### 1. Admin crea docentes
```
admin@universidad.edu
  └─> Crea docente-001
  └─> Crea docente-002
```

### 2. Docentes o Admin registran estudiantes
```
docente-001
  └─> Registra estudiante 1234567890
  └─> Registra estudiante 0987654321
```

### 3. Docentes registran calificaciones y asistencia
```
docente-001
  └─> Registra calificaciones en MAT-101
  └─> Registra asistencia en MAT-101
```

### 4. Sistema genera predicciones
```
Sistema de IA
  └─> Analiza datos del estudiante
  └─> Genera predicción de riesgo
  └─> Almacena resultado
```

### 5. Admin/Docente visualiza resultados
```
admin@universidad.edu
  └─> Ve dashboard con estudiantes en riesgo
  └─> Revisa predicciones
  └─> Toma acciones correctivas
```

---

## 🎯 Resumen

### Usuarios del Sistema Administrativo
- **admin**: Control total
- **docente**: Gestión académica

### No son usuarios del sistema
- **estudiantes**: Datos gestionados, no tienen login

### Colecciones MongoDB
- `usuarios`: admin y docentes
- `estudiantes`: Información académica (sin credenciales)

Este diseño separa claramente los roles administrativos de los datos de estudiantes, permitiendo una gestión más segura y organizada del sistema.
