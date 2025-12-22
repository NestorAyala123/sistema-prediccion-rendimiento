# Estructura de la Base de Datos

## Sistema de Predicción de Rendimiento Académico

### Tecnología
- **Base de Datos**: MongoDB (NoSQL)
- **ODM**: Mongoose para Node.js/NestJS
- **Paradigma**: Orientado a documentos

---

## Colecciones MongoDB

### 1. **usuarios**
Almacena información de administradores, profesores, consejeros y estudiantes.

```javascript
{
  _id: ObjectId,
  id_usuario: String (unique),      // Identificador único
  nombre_usuario: String,            // Nombre completo
  rol: String,                       // 'administrador', 'docente', 'estudiante', 'consejero'
  password_hash: String,             // Contraseña hasheada con bcrypt
  email: String (unique),            // Correo electrónico
  activo: Boolean,                   // Estado de la cuenta
  ultimo_acceso: Date,               // Última vez que ingresó
  createdAt: Date,                   // Fecha de creación (automático)
  updatedAt: Date                    // Fecha de actualización (automático)
}
```

**Índices**: `email`, `rol`, `id_usuario`

### 2. **estudiantes**
Información de los estudiantes del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_estudiante | VARCHAR(20) PK | Cédula o ID único |
| nombres | VARCHAR(100) | Nombres del estudiante |
| apellidos | VARCHAR(100) | Apellidos del estudiante |
| email | VARCHAR(150) UNIQUE | Correo electrónico |
| semestre_actual | INTEGER | Semestre que cursa |
| id_usuario | VARCHAR(36) FK | Usuario consejero asignado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 3. **asignaturas**
Catálogo de materias disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_asignatura | VARCHAR(20) PK | Código de la materia |
| nombre_asignatura | VARCHAR(200) | Nombre completo de la materia |
| creditos | INTEGER | Créditos académicos |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Datos de ejemplo**:
- MAT-101: Cálculo I (4 créditos)
- FIS-101: Física I (3 créditos)
- PROG-101: Programación I (4 créditos)
- ING-101: Inglés I (2 créditos)
- HIS-101: Historia (2 créditos)
- MAT-102: Cálculo II (4 créditos)
- QUI-101: Química General (3 créditos)
- EST-101: Estadística (3 créditos)

### 4. **inscripciones**
Tabla intermedia que relaciona estudiantes con asignaturas en un período académico.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_inscripcion | VARCHAR(36) PK | UUID de la inscripción |
| id_estudiante | VARCHAR(20) FK | Referencia al estudiante |
| id_asignatura | VARCHAR(20) FK | Referencia a la asignatura |
| periodo_academico | VARCHAR(20) | Período (ej: "2025-01") |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Constraint**: `UNIQUE(id_estudiante, id_asignatura, periodo_academico)`

### 5. **calificaciones**
Registro de notas de evaluaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_calificacion | VARCHAR(36) PK | UUID de la calificación |
| id_inscripcion | VARCHAR(36) FK | Referencia a la inscripción |
| tipo_evaluacion | VARCHAR(50) | Tipo: 'Parcial 1', 'Deber', 'Examen Final', etc. |
| nota | DECIMAL(3,2) | Nota de 0 a 10 |
| fecha_registro | TIMESTAMP | Fecha de registro de la nota |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Constraint**: `CHECK (nota >= 0 AND nota <= 10)`

### 6. **asistencias**
Control de asistencia a clases.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_asistencia | VARCHAR(36) PK | UUID de la asistencia |
| id_inscripcion | VARCHAR(36) FK | Referencia a la inscripción |
| fecha_clase | DATE | Fecha de la clase |
| estado | VARCHAR(20) | Estado: 'Presente', 'Ausente', 'Justificado' |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Constraint**: `CHECK (estado IN ('Presente', 'Ausente', 'Justificado'))`

### 7. **habitos_estudio**
Información sobre hábitos de estudio de los estudiantes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_habito | VARCHAR(36) PK | UUID del registro |
| id_estudiante | VARCHAR(20) FK | Referencia al estudiante |
| fecha_encuesta | DATE | Fecha de la encuesta |
| horas_estudio_semanales | INTEGER | Horas de estudio por semana |
| lugar_estudio | VARCHAR(100) | Lugar: 'Biblioteca', 'Casa', 'Grupo' |
| usa_tecnicas_estudio | BOOLEAN | Si usa técnicas de estudio |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Constraint**: `CHECK (horas_estudio_semanales >= 0)`

### 8. **predicciones_riesgo**
Predicciones de riesgo académico generadas por el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_prediccion | VARCHAR(36) PK | UUID de la predicción |
| id_estudiante | VARCHAR(20) FK | Referencia al estudiante |
| fecha_prediccion | TIMESTAMP | Fecha de la predicción |
| nivel_riesgo | VARCHAR(20) | Nivel: 'Bajo', 'Medio', 'Alto' |
| factores_clave | TEXT | Descripción de factores |
| estado_prediccion | VARCHAR(20) | Estado: 'Calculando', 'Completado' |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Constraints**: 
- `CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto'))`
- `CHECK (estado_prediccion IN ('Calculando', 'Completado'))`

---

## Colección MongoDB

### **auditorias**
Registro de auditoría de todas las operaciones del sistema.

```javascript
{
  _id: ObjectId,
  usuario_id: String,          // ID del usuario que realizó la acción
  usuario_nombre: String,       // Nombre del usuario
  accion: String,              // Tipo de acción: 'CREATE', 'READ', 'UPDATE', 'DELETE'
  entidad: String,             // Entidad afectada: 'Estudiante', 'Calificacion', etc.
  entidad_id: String,          // ID del registro afectado
  detalles: Object,            // Detalles adicionales de la operación
  ip_address: String,          // Dirección IP del usuario
  timestamp: Date              // Fecha y hora de la acción
}
```

---

## Relaciones entre Tablas

```
usuarios (1) ──────── (n) estudiantes
                           │
                           ├── (n) inscripciones ──── (1) asignaturas
                           │         │
                           │         ├── (n) calificaciones
                           │         └── (n) asistencias
                           │
                           ├── (n) habitos_estudio
                           └── (n) predicciones_riesgo
```

## Índices para Optimización

```sql
-- Índices en estudiantes
idx_estudiantes_email
idx_estudiantes_usuario

-- Índices en inscripciones
idx_inscripciones_estudiante
idx_inscripciones_asignatura
idx_inscripciones_periodo

-- Índices en calificaciones
idx_calificaciones_inscripcion

-- Índices en asistencias
idx_asistencias_inscripcion
idx_asistencias_fecha

-- Índices en hábitos de estudio
idx_habitos_estudiante

-- Índices en predicciones
idx_predicciones_estudiante
idx_predicciones_fecha
idx_predicciones_nivel
```

---

## Datos de Ejemplo

El sistema incluye datos de prueba:

### **Usuarios**:
- admin-001: Administrador Principal
- consejero-001: María González (Consejero)
- profesor-001: Carlos Rodríguez (Profesor)

### **Estudiantes**:
- **Juan Pérez** (1234567890): Semestre 3
  - Asignaturas: MAT-101, FIS-101, PROG-101, ING-101
  - Rendimiento: Bueno (promedio ~8.0)
  - Riesgo: Bajo
  
- **Ana García** (0987654321): Semestre 2
  - Asignaturas: MAT-101, QUI-101, ING-101, HIS-101
  - Rendimiento: Regular (promedio ~5.7 en Cálculo)
  - Riesgo: Alto (baja asistencia 60%, bajas notas)
  
- **Luis Martínez** (1122334455): Semestre 4
  - Asignaturas: MAT-102, FIS-101, EST-101, PROG-101
  - Rendimiento: Excelente (promedio ~9.0)
  - Riesgo: Bajo (asistencia perfecta)

---

## Ubicación de Archivos

- **Configuración TypeORM**: `backend/src/database/database.config.ts`
- **Script SQL**: `backend/src/database/init.sql`
- **Configuración MongoDB**: `backend/src/database/mongodb.config.ts`
- **Entidades**: `backend/src/entities/*.entity.ts`
- **Schemas MongoDB**: `backend/src/schemas/*.schema.ts`
- **Base de datos SQLite**: `backend/database/academic_prediction.db` (auto-generada)

---

## Notas Importantes

1. **Sincronización**: La opción `synchronize: true` en TypeORM está habilitada solo para desarrollo. En producción debe ser `false`.

2. **Migraciones**: El sistema está configurado para usar migraciones en `dist/migrations/*.js`.

3. **Validaciones**: Las restricciones CHECK y UNIQUE garantizan la integridad de los datos.

4. **Auditoría**: Todas las operaciones críticas se registran en MongoDB para trazabilidad.

5. **Soft Delete**: Se recomienda implementar eliminación lógica en lugar de física para mantener historial.
