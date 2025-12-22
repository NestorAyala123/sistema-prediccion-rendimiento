# Estructura de la Base de Datos - MongoDB

## Sistema de Predicción de Rendimiento Académico

### Tecnología
- **Base de Datos**: MongoDB 6.0+
- **ODM**: Mongoose
- **Driver**: MongoDB Node.js Driver

---

## 📦 Colecciones

### 1. **usuarios**
```javascript
{
  _id: ObjectId,
  id_usuario: String (unique, indexed),
  nombre_usuario: String,
  rol: String, // 'admin', 'docente'
  password_hash: String,
  email: String (unique, indexed),
  activo: Boolean,
  ultimo_acceso: Date,
  createdAt: Date,
  updatedAt: Date
}
```
**Nota**: Los estudiantes NO son usuarios del sistema, se gestionan en la colección `estudiantes`.

### 2. **estudiantes**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (unique, indexed), // Cédula
  nombres: String,
  apellidos: String (indexed),
  email: String (unique, indexed),
  telefono: String,
  direccion: String,
  fecha_nacimiento: Date,
  semestre_actual: Number (indexed),
  carrera: String,
  promedio_general: Number,
  activo: Boolean,
  fecha_ingreso: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **asignaturas**
```javascript
{
  _id: ObjectId,
  id_asignatura: String (unique, indexed), // Código
  nombre_asignatura: String (indexed),
  creditos: Number,
  descripcion: String,
  semestre: Number (indexed),
  prerequisitos: [String], // Array de códigos
  departamento: String (indexed),
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **inscripciones**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (indexed),
  id_asignatura: String (indexed),
  periodo_academico: String (indexed), // "2025-01"
  profesor: String,
  horario: String,
  estado: String, // 'inscrito', 'cursando', 'aprobado', 'reprobado', 'retirado'
  nota_final: Number,
  fecha_inscripcion: Date,
  createdAt: Date,
  updatedAt: Date
}
```
**Índice único**: `{id_estudiante, id_asignatura, periodo_academico}`

### 5. **calificaciones**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (indexed),
  id_asignatura: String (indexed),
  periodo_academico: String (indexed),
  tipo_evaluacion: String (indexed), // 'Parcial 1', 'Deber', 'Examen Final'
  nota: Number, // 0-10
  porcentaje: Number, // Peso 0-100
  observaciones: String,
  fecha_registro: Date (indexed),
  fecha_evaluacion: Date,
  registrado_por: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Índice compuesto**: `{id_estudiante, id_asignatura, periodo_academico}`

### 6. **asistencias**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (indexed),
  id_asignatura: String (indexed),
  periodo_academico: String (indexed),
  fecha_clase: Date (indexed),
  estado: String (indexed), // 'Presente', 'Ausente', 'Justificado', 'Tardanza'
  justificacion: String,
  observaciones: String,
  registrado_por: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Índice único**: `{id_estudiante, id_asignatura, fecha_clase}`

### 7. **habitos_estudio**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (indexed),
  fecha_encuesta: Date (indexed),
  horas_estudio_semanales: Number,
  lugar_estudio: String, // 'Biblioteca', 'Casa', 'Grupo'
  usa_tecnicas_estudio: Boolean,
  tecnicas_utilizadas: [String],
  horario_preferido: String,
  distracciones: [String],
  motivacion: String, // 'Alta', 'Media', 'Baja'
  apoyo_familiar: Boolean,
  trabaja: Boolean,
  horas_trabajo_semanales: Number,
  observaciones: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. **predicciones_riesgo**
```javascript
{
  _id: ObjectId,
  id_estudiante: String (indexed),
  periodo_academico: String (indexed),
  fecha_prediccion: Date (indexed),
  nivel_riesgo: String (indexed), // 'Bajo', 'Medio', 'Alto', 'Crítico'
  probabilidad_desercion: Number, // 0-100
  factores_riesgo: {
    promedio_bajo: Boolean,
    asistencia_baja: Boolean,
    habitos_inadecuados: Boolean,
    problemas_economicos: Boolean,
    falta_motivacion: Boolean
  },
  factores_clave: String,
  metricas: {
    promedio_actual: Number,
    porcentaje_asistencia: Number,
    materias_reprobadas: Number,
    horas_estudio: Number
  },
  recomendaciones: [String],
  estado_prediccion: String (indexed), // 'Calculando', 'Completado', 'Error'
  modelo_usado: String,
  version_modelo: String,
  generado_por: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 9. **auditorias**
```javascript
{
  _id: ObjectId,
  usuario_id: String (indexed),
  usuario_email: String,
  accion: String (indexed), // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  modulo: String (indexed), // 'estudiantes', 'calificaciones', etc.
  datos_anteriores: Object,
  datos_nuevos: Object,
  ip_address: String,
  user_agent: String,
  fecha: Date (indexed),
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Relaciones

MongoDB no tiene joins nativos, pero usamos referencias:

```
usuario (admin | docente)
  └── Gestiona el sistema

estudiante (colección independiente)
  ├── inscripciones (id_estudiante)
  │      └── calificaciones (id_estudiante + id_asignatura)
  │      └── asistencias (id_estudiante + id_asignatura)
  ├── habitos_estudio (id_estudiante)
  └── predicciones_riesgo (id_estudiante)

asignatura (id_asignatura)
  └── inscripciones (id_asignatura)
```

**Nota importante**: Los estudiantes son una entidad separada de los usuarios. Los usuarios solo son admin y docentes que gestionan el sistema.

---

## 📊 Índices Implementados

### usuarios
- `{ email: 1 }`
- `{ rol: 1 }`
- `{ id_usuario: 1 }`

### estudiantes }`
- `{ email: 1 }`
- `{ apellidos: 1, nombres: 1 }`
- `{ semestre_actual: 1 }`
- `{ id_usuario: 1 }`

### asignaturas
- `{ id_asignatura: 1 }`
- `{ nombre_asignatura: 1 }`
- `{ semestre: 1 }`
- `{ departamento: 1 }`

### inscripciones
- `{ id_estudiante: 1, periodo_academico: -1 }`
- `{ id_asignatura: 1, periodo_academico: -1 }`
- `{ periodo_academico: -1 }`
- `{ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 }` (unique)
- `{ estado: 1 }`

### calificaciones
- `{ id_estudiante: 1, periodo_academico: -1 }`
- `{ id_asignatura: 1, periodo_academico: -1 }`
- `{ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 }`
- `{ tipo_evaluacion: 1 }`
- `{ fecha_registro: -1 }`

### asistencias
- `{ id_estudiante: 1, periodo_academico: -1 }`
- `{ id_asignatura: 1, periodo_academico: -1 }`
- `{ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 }`
- `{ fecha_clase: -1 }`
- `{ estado: 1 }`
- `{ id_estudiante: 1, id_asignatura: 1, fecha_clase: 1 }` (unique)

### habitos_estudio
- `{ id_estudiante: 1, fecha_encuesta: -1 }`
- `{ fecha_encuesta: -1 }`

### predicciones_riesgo
- `{ id_estudiante: 1, fecha_prediccion: -1 }`
- `{ nivel_riesgo: 1 }`
- `{ periodo_academico: -1 }`
- `{ estado_prediccion: 1 }`

### auditorias
- `{ usuario_id: 1, fecha: -1 }`
- `{ accion: 1, fecha: -1 }`
- `{ modulo: 1, fecha: -1 }`

---

## 🚀 Inicialización

### Configuración (backend/src/database/mongodb.config.ts)
```typescript
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_prediction',
  options: {
    retryWrites: true,
    w: 'majority',
  },
};
```

### Seed de Datos
```bash
cd backend
npm run seed
```

Esto crea:
- 3 usuarios (admin, consejero, docente)
- 3 estudiantes con perfiles diferentes
- 8 asignaturas
- 12 inscripciones
- 17 calificaciones
- 15 asistencias
- 3 hábitos de estudio
- 3 predicciones de riesgo

---

## 📝 Consultas Comunes

### Obtener estudiante con todas sus calificaciones
```javascript
// Agregation Pipeline
db.calificaciones.aggregate([
  { $match: { id_estudiante: "1234567890", periodo_academico: "2025-01" } },
  { $group: {
      _id: "$id_asignatura",
      promedio: { $avg: "$nota" },
      evaluaciones: { $push: { tipo: "$tipo_evaluacion", nota: "$nota" } }
  }}
]);
```

### Porcentaje de asistencia por estudiante
```javascript
db.asistencias.aggregate([
  { $match: { id_estudiante: "1234567890" } },
  { $group: {
      _id: "$id_asignatura",
      total: { $sum: 1 },
      presentes: {
        $sum: { $cond: [{ $in: ["$estado", ["Presente", "Justificado"]] }, 1, 0] }
      }
  }},
  { $project: {
      porcentaje: { $multiply: [{ $divide: ["$presentes", "$total"] }, 100] }
  }}
]);
```

### Estudiantes en riesgo
```javascript
db.predicciones_riesgo.find({
  nivel_riesgo: { $in: ["Alto", "Crítico"] },
  estado_prediccion: "Completado"
}).sort({ probabilidad_desercion: -1 });
```

---

## 🔧 Ventajas de MongoDB

1. **Flexibilidad**: Esquema dinámico, fácil añadir campos
2. **Escalabilidad**: Escalado horizontal nativo
3. **Rendimiento**: Consultas rápidas con índices apropiados
4. **Agregaciones**: Pipeline potente para análisis complejos
5. **Embebido**: Posibilidad de embeber documentos relacionados
6. **JSON nativo**: Integración natural con aplicaciones JavaScript/TypeScript

---

## 📂 Ubicación de Archivos

- **Configuración**: `backend/src/database/mongodb.config.ts`
- **Schemas**: `backend/src/schemas/*.schema.ts`
- **Seed**: `backend/src/database/seed.ts`
- **Módulos**: `backend/src/modules/*/`

---

## 🔒 Seguridad

1. **Autenticación**: MongoDB con usuario/contraseña en producción
2. **Conexión**: SSL/TLS en producción
3. **Validación**: Schema validation a nivel de MongoDB
4. **Sanitización**: Mongoose sanitiza automáticamente
5. **Auditoría**: Todas las operaciones se registran

---

**Última actualización:** 22 de diciembre de 2025
