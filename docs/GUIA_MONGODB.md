# 🗄️ Base de Datos MongoDB - Guía Completa

## Sistema de Predicción de Rendimiento Académico

---

## 🚀 Inicio Rápido

### Prerequisitos
```bash
# Instalar MongoDB
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Verificar instalación
mongod --version
```

### 1. Iniciar MongoDB
```bash
# Windows
mongod --dbpath=C:\data\db

# Mac/Linux
mongod --dbpath=/data/db

# O usar MongoDB como servicio
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 2. Instalar Dependencias
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo .env en backend/
MONGODB_URI=mongodb://localhost:27017/academic_prediction
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=3000
```

### 4. Poblar la Base de Datos
```bash
cd backend
npm run seed
```

Esto creará:
- ✅ 3 usuarios (admin, consejero, docente)
- ✅ 3 estudiantes con diferentes perfiles
- ✅ 8 asignaturas
- ✅ 12 inscripciones
- ✅ 17 calificaciones  
- ✅ 15 registros de asistencia
- ✅ 3 perfiles de hábitos de estudio
- ✅ 3 predicciones de riesgo

### 5. Iniciar el Backend
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📦 Colecciones de la Base de Datos

### **usuarios**
Administradores y docentes del sistema.
```javascript
{
  id_usuario: "admin-001",
  nombre_usuario: "Administrador Principal",
  rol: "admin", // admin | docente
  email: "admin@universidad.edu",
  password_hash: "$2b$10$...",
  activo: true
}
```

### **estudiantes**
Información académica de estudiantes (separados de usuarios).
```javascript
{
  id_estudiante: "1234567890", // Cédula
  nombres: "Juan",
  apellidos: "Pérez",
  email: "juan.perez@universidad.edu",
  telefono: "0991234567",
  semestre_actual: 3,
  carrera: "Ingeniería en Sistemas",
  promedio_general: 8.0,
  activo: true
}
```

### **asignaturas**
Catálogo de materias.
```javascript
{
  id_asignatura: "MAT-101",
  nombre_asignatura: "Cálculo I",
  creditos: 4,
  semestre: 1,
  prerequisitos: [],
  departamento: "Matemáticas"
}
```

### **inscripciones**
Relación estudiante-materia por periodo.
```javascript
{
  id_estudiante: "1234567890",
  id_asignatura: "MAT-101",
  periodo_academico: "2025-01",
  estado: "cursando", // inscrito | cursando | aprobado | reprobado | retirado
  nota_final: null
}
```

### **calificaciones**
Notas de evaluaciones.
```javascript
{
  id_estudiante: "1234567890",
  id_asignatura: "MAT-101",
  periodo_academico: "2025-01",
  tipo_evaluacion: "Parcial 1",
  nota: 7.5, // 0-10
  porcentaje: 30, // Peso de la evaluación
  fecha_registro: ISODate("2025-01-15")
}
```

### **asistencias**
Control de asistencia a clases.
```javascript
{
  id_estudiante: "1234567890",
  id_asignatura: "MAT-101",
  periodo_academico: "2025-01",
  fecha_clase: ISODate("2025-01-15"),
  estado: "Presente", // Presente | Ausente | Justificado | Tardanza
  observaciones: ""
}
```

### **habitos_estudio**
Información sobre hábitos de estudio.
```javascript
{
  id_estudiante: "1234567890",
  fecha_encuesta: ISODate("2025-01-10"),
  horas_estudio_semanales: 15,
  lugar_estudio: "Biblioteca",
  usa_tecnicas_estudio: true,
  tecnicas_utilizadas: ["Resumen", "Mapas mentales"],
  motivacion: "Alta",
  trabaja: false
}
```

### **predicciones_riesgo**
Análisis predictivo de deserción.
```javascript
{
  id_estudiante: "1234567890",
  periodo_academico: "2025-01",
  fecha_prediccion: ISODate("2025-01-20"),
  nivel_riesgo: "Bajo", // Bajo | Medio | Alto | Crítico
  probabilidad_desercion: 15, // Porcentaje
  factores_clave: "Buen rendimiento general...",
  metricas: {
    promedio_actual: 8.0,
    porcentaje_asistencia: 80,
    materias_reprobadas: 0,
    horas_estudio: 15
  },
  recomendaciones: ["Mantener el ritmo..."],
  estado_prediccion: "Completado"
}
```

### **auditorias**
Registro de operaciones del sistema.
```javascript
{
  usuario_id: "admin-001",
  usuario_email: "admin@universidad.edu",
  accion: "CREATE", // CREATE | UPDATE | DELETE | LOGIN
  modulo: "estudiantes",
  datos_anteriores: {},
  datos_nuevos: {...},
  ip_address: "192.168.1.1",
  fecha: ISODate("2025-01-20")
}
```

---

## 🔧 Operaciones Comunes

### Conectarse a MongoDB
```bash
# Terminal MongoDB
mongosh

# Usar la base de datos
use academic_prediction

# Ver colecciones
show collections

# Contar documentos
db.estudiantes.countDocuments()
```

### Consultas Útiles

#### Ver todos los estudiantes
```javascript
db.estudiantes.find().pretty()
```

#### Buscar estudiante específico
```javascript
db.estudiantes.findOne({ id_estudiante: "1234567890" })
```

#### Calificaciones de un estudiante
```javascript
db.calificaciones.find({
  id_estudiante: "1234567890",
  periodo_academico: "2025-01"
}).sort({ fecha_registro: -1 })
```

#### Promedio por materia
```javascript
db.calificaciones.aggregate([
  { $match: { id_estudiante: "1234567890" } },
  { $group: {
      _id: "$id_asignatura",
      promedio: { $avg: "$nota" },
      count: { $sum: 1 }
  }}
])
```

#### Porcentaje de asistencia
```javascript
db.asistencias.aggregate([
  { $match: { id_estudiante: "1234567890" } },
  { $group: {
      _id: "$id_asignatura",
      total: { $sum: 1 },
      presentes: {
        $sum: { $cond: [{ $eq: ["$estado", "Presente"] }, 1, 0] }
      }
  }},
  { $project: {
      porcentaje: { $multiply: [{ $divide: ["$presentes", "$total"] }, 100] }
  }}
])
```

#### Estudiantes en riesgo alto
```javascript
db.predicciones_riesgo.find({
  nivel_riesgo: "Alto",
  estado_prediccion: "Completado"
}).sort({ probabilidad_desercion: -1 })
```

#### Asignaturas más cursadas
```javascript
db.inscripciones.aggregate([
  { $match: { periodo_academico: "2025-01" } },
  { $group: {
      _id: "$id_asignatura",
      total_estudiantes: { $sum: 1 }
  }},
  { $sort: { total_estudiantes: -1 } }
])
```

---

## 📊 API Endpoints

Todos los endpoints requieren autenticación JWT excepto `/auth/login`

### Autenticación
```
POST   /auth/login              # Iniciar sesión
POST   /auth/register           # Registrar usuario
GET    /auth/profile            # Perfil del usuario
```

### Estudiantes
```
GET    /estudiantes             # Listar todos
GET    /estudiantes/:id         # Ver detalle
POST   /estudiantes             # Crear nuevo
PUT    /estudiantes/:id         # Actualizar
DELETE /estudiantes/:id         # Eliminar
```

### Asignaturas
```
GET    /asignaturas             # Listar todas
GET    /asignaturas/:id         # Ver detalle
POST   /asignaturas             # Crear nueva
PUT    /asignaturas/:id         # Actualizar
DELETE /asignaturas/:id         # Eliminar
```

### Inscripciones
```
GET    /inscripciones                                    # Listar todas
GET    /inscripciones/estudiante/:id                     # Por estudiante
GET    /inscripciones/periodo/:periodo                   # Por periodo
POST   /inscripciones                                    # Crear nueva
PUT    /inscripciones/:id                                # Actualizar
DELETE /inscripciones/:id                                # Eliminar
```

### Calificaciones
```
GET    /calificaciones/estudiante/:id                    # Por estudiante
POST   /calificaciones                                   # Registrar nota
PUT    /calificaciones/:id                               # Actualizar
DELETE /calificaciones/:id                               # Eliminar
```

### Asistencias
```
GET    /asistencias/estudiante/:id                       # Por estudiante
GET    /asistencias/asignatura/:id/periodo/:periodo      # Estadísticas
POST   /asistencias                                      # Registrar
PUT    /asistencias/:id                                  # Actualizar
DELETE /asistencias/:id                                  # Eliminar
```

### Predicciones
```
GET    /predicciones/estudiante/:id                      # Por estudiante
POST   /predicciones/calcular                            # Calcular nueva
GET    /predicciones/riesgo/:nivel                       # Por nivel de riesgo
```

---

## 🔒 Seguridad

### Usuarios por Defecto (Seed)
```
Admin:
  Email: admin@universidad.edu
  Password: password123

Docente 1:
  Email: carlos.rodriguez@universidad.edu
  Password: password123

Docente 2:
  Email: maria.gonzalez@universidad.edu
  Password: password123
```

⚠️ **IMPORTANTE**: Cambiar estas contraseñas en producción

**Nota**: Los estudiantes NO son usuarios del sistema. Se registran por separado en la colección `estudiantes` con su propia interfaz.

### Configuración de Seguridad

1. **Contraseñas**: Hasheadas con bcrypt (10 rounds)
2. **JWT**: Tokens con expiración de 24h
3. **MongoDB**: Autenticación habilitada en producción
4. **Validación**: DTOs con class-validator
5. **CORS**: Configurado para dominio específico

---

## 📈 Monitoreo

### Ver logs en tiempo real
```bash
# Backend
cd backend
npm run start:dev

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### MongoDB Compass
Interfaz gráfica para MongoDB:
1. Descargar: https://www.mongodb.com/products/compass
2. Conectar: `mongodb://localhost:27017`
3. Seleccionar DB: `academic_prediction`

---

## 🔧 Troubleshooting

### MongoDB no inicia
```bash
# Verificar que el puerto 27017 esté libre
netstat -an | findstr 27017

# Iniciar manualmente
mongod --dbpath=C:\data\db

# Verificar logs
cat /var/log/mongodb/mongod.log
```

### Error de conexión en NestJS
```bash
# Verificar URI en .env
MONGODB_URI=mongodb://localhost:27017/academic_prediction

# Verificar que MongoDB esté corriendo
mongosh --eval "db.adminCommand('ping')"
```

### Datos de seed no aparecen
```bash
# Limpiar y volver a ejecutar seed
cd backend
npm run seed
```

### Error de autenticación
```bash
# Verificar JWT_SECRET en .env
JWT_SECRET=tu_secreto_super_seguro_aqui

# Reiniciar backend
npm run start:dev
```

---

## 📚 Recursos Adicionales

- [Documentación MongoDB](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [NestJS MongoDB](https://docs.nestjs.com/techniques/mongodb)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB University](https://university.mongodb.com/)

---

## 📝 Archivos Importantes

```
backend/
├── src/
│   ├── database/
│   │   ├── mongodb.config.ts    # Configuración de conexión
│   │   └── seed.ts               # Script de datos iniciales
│   ├── schemas/                  # Schemas de Mongoose
│   │   ├── usuario.schema.ts
│   │   ├── estudiante.schema.ts
│   │   ├── asignatura.schema.ts
│   │   ├── inscripcion.schema.ts
│   │   ├── calificacion.schema.ts
│   │   ├── asistencia.schema.ts
│   │   ├── habito-estudio.schema.ts
│   │   ├── prediccion-riesgo.schema.ts
│   │   └── auditoria.schema.ts
│   └── modules/                  # Módulos de la aplicación
├── .env                          # Variables de entorno
└── package.json                  # Dependencias y scripts
```

---

**Última actualización:** 22 de diciembre de 2025
**Base de Datos:** MongoDB 6.0+
**Estado:** ✅ Completamente implementado y funcional
