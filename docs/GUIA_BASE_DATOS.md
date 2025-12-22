# Guía de Uso - Base de Datos del Sistema

## Introducción

El sistema cuenta con una base de datos completa que incluye:
- ✅ **Estudiantes**: Registro de estudiantes con información personal y académica
- ✅ **Asignaturas**: Catálogo de materias con créditos
- ✅ **Inscripciones**: Relación estudiante-asignatura por periodo académico
- ✅ **Calificaciones**: Registro de notas por tipo de evaluación
- ✅ **Asistencias**: Control de presencia en clases
- ✅ **Hábitos de Estudio**: Información sobre métodos y tiempo de estudio
- ✅ **Predicciones de Riesgo**: Análisis predictivo del rendimiento
- ✅ **Usuarios**: Administradores, profesores y consejeros
- ✅ **Auditoría** (MongoDB): Registro de todas las operaciones

---

## Inicialización de la Base de Datos

### Opción 1: Automática (Recomendada)

El sistema utiliza TypeORM con `synchronize: true` en desarrollo, lo que significa que:

1. **Al iniciar el backend**, se crea automáticamente la base de datos SQLite
2. **Se ejecuta el script** `init.sql` con datos de ejemplo
3. **Se crean todas las tablas** según las entidades definidas

```bash
cd backend
npm install
npm run start:dev
```

### Opción 2: Manual

Si deseas ejecutar el script SQL manualmente:

```bash
cd backend
sqlite3 database/academic_prediction.db < src/database/init.sql
```

---

## Datos de Ejemplo Incluidos

### 👥 Usuarios
- **admin-001**: Administrador Principal
- **consejero-001**: María González (Consejero)
- **profesor-001**: Carlos Rodríguez (Profesor)

### 🎓 Estudiantes
1. **Juan Pérez** (ID: 1234567890)
   - Semestre 3
   - 4 materias inscritas
   - Rendimiento: Bueno (promedio 8.0)
   - Asistencia: 80%
   - Nivel de Riesgo: **Bajo**

2. **Ana García** (ID: 0987654321)
   - Semestre 2
   - 4 materias inscritas
   - Rendimiento: Regular (promedio 5.7 en Cálculo)
   - Asistencia: 60%
   - Nivel de Riesgo: **Alto** ⚠️

3. **Luis Martínez** (ID: 1122334455)
   - Semestre 4
   - 4 materias inscritas
   - Rendimiento: Excelente (promedio 9.0)
   - Asistencia: 100%
   - Nivel de Riesgo: **Bajo**

### 📚 Asignaturas
- MAT-101: Cálculo I (4 créditos)
- MAT-102: Cálculo II (4 créditos)
- FIS-101: Física I (3 créditos)
- PROG-101: Programación I (4 créditos)
- QUI-101: Química General (3 créditos)
- EST-101: Estadística (3 créditos)
- ING-101: Inglés I (2 créditos)
- HIS-101: Historia (2 créditos)

---

## API Endpoints Disponibles

### 🎓 Estudiantes
```
GET    /estudiantes              # Listar todos
GET    /estudiantes/:id          # Ver detalle
POST   /estudiantes              # Crear nuevo
PUT    /estudiantes/:id          # Actualizar
DELETE /estudiantes/:id          # Eliminar
```

### 📚 Asignaturas
```
GET    /asignaturas              # Listar todas
GET    /asignaturas/:id          # Ver detalle
POST   /asignaturas              # Crear nueva
PUT    /asignaturas/:id          # Actualizar
DELETE /asignaturas/:id          # Eliminar
```

### 📝 Inscripciones
```
GET    /inscripciones                                    # Listar todas
GET    /inscripciones/estudiante/:id                     # Por estudiante
GET    /inscripciones/periodo/:periodo                   # Por periodo
GET    /inscripciones/asignatura/:id                     # Por asignatura
GET    /inscripciones/asignatura/:id/periodo/:periodo    # Por asignatura y periodo
GET    /inscripciones/estadisticas/periodo/:periodo      # Estadísticas
POST   /inscripciones                                    # Crear nueva
PUT    /inscripciones/:id                                # Actualizar
DELETE /inscripciones/:id                                # Eliminar
```

**Ejemplo de inscripción:**
```json
{
  "id_estudiante": "1234567890",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01"
}
```

### 📊 Calificaciones
```
GET    /calificaciones                                  # Listar todas
GET    /calificaciones/estudiante/:id                   # Por estudiante
GET    /calificaciones/periodo/:periodo                 # Por periodo
GET    /calificaciones/asignatura/:id/periodo/:periodo  # Por asignatura y periodo
GET    /calificaciones/promedio/estudiante/:id/periodo/:periodo  # Promedio
POST   /calificaciones                                  # Crear (por inscripción)
POST   /calificaciones/por-periodo                      # Crear (método simplificado)
PUT    /calificaciones/:id                              # Actualizar
DELETE /calificaciones/:id                              # Eliminar
```

**Ejemplo de calificación (método simplificado):**
```json
{
  "id_estudiante": "1234567890",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01",
  "tipo_evaluacion": "Parcial 1",
  "nota": 8.5
}
```

### ✅ Asistencias
```
GET    /asistencias                                      # Listar todas
GET    /asistencias/estudiante/:id                       # Por estudiante
GET    /asistencias/inscripcion/:id                      # Por inscripción
GET    /asistencias/fecha/:fecha                         # Por fecha
GET    /asistencias/rango?fecha_inicio=X&fecha_fin=Y     # Por rango
GET    /asistencias/estadisticas/asignatura/:id/periodo/:periodo  # Estadísticas
POST   /asistencias                                      # Registrar
PUT    /asistencias/:id                                  # Actualizar
DELETE /asistencias/:id                                  # Eliminar
```

**Ejemplo de asistencia:**
```json
{
  "id_inscripcion": "insc-001",
  "fecha_clase": "2025-01-15",
  "estado": "Presente"
}
```

Estados válidos: `"Presente"`, `"Ausente"`, `"Justificado"`

### 🔮 Predicciones
```
GET    /predicciones                 # Listar todas
GET    /predicciones/estudiante/:id  # Por estudiante
POST   /predicciones/calcular        # Calcular nueva predicción
```

---

## Consultas SQL Útiles

### Ver todos los estudiantes con sus inscripciones
```sql
SELECT 
    e.id_estudiante,
    e.nombres || ' ' || e.apellidos as nombre_completo,
    a.nombre_asignatura,
    i.periodo_academico
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
JOIN asignaturas a ON i.id_asignatura = a.id_asignatura
ORDER BY e.apellidos, i.periodo_academico;
```

### Promedio de calificaciones por estudiante
```sql
SELECT 
    e.nombres || ' ' || e.apellidos as estudiante,
    a.nombre_asignatura as materia,
    ROUND(AVG(c.nota), 2) as promedio
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
JOIN asignaturas a ON i.id_asignatura = a.id_asignatura
JOIN calificaciones c ON i.id_inscripcion = c.id_inscripcion
GROUP BY e.id_estudiante, a.id_asignatura
ORDER BY estudiante, promedio DESC;
```

### Porcentaje de asistencia por estudiante y materia
```sql
SELECT 
    e.nombres || ' ' || e.apellidos as estudiante,
    a.nombre_asignatura as materia,
    COUNT(*) as total_clases,
    SUM(CASE WHEN ast.estado = 'Presente' THEN 1 ELSE 0 END) as presentes,
    ROUND(100.0 * SUM(CASE WHEN ast.estado = 'Presente' THEN 1 ELSE 0 END) / COUNT(*), 2) as porcentaje
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
JOIN asignaturas a ON i.id_asignatura = a.id_asignatura
JOIN asistencias ast ON i.id_inscripcion = ast.id_inscripcion
GROUP BY e.id_estudiante, a.id_asignatura
ORDER BY porcentaje ASC;
```

### Estudiantes en riesgo (promedio < 7 o asistencia < 75%)
```sql
-- Por calificaciones bajas
SELECT DISTINCT
    e.id_estudiante,
    e.nombres || ' ' || e.apellidos as estudiante,
    a.nombre_asignatura,
    ROUND(AVG(c.nota), 2) as promedio
FROM estudiantes e
JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
JOIN asignaturas a ON i.id_asignatura = a.id_asignatura
JOIN calificaciones c ON i.id_inscripcion = c.id_inscripcion
GROUP BY e.id_estudiante, a.id_asignatura
HAVING AVG(c.nota) < 7
ORDER BY promedio;
```

---

## Flujo de Trabajo Típico

### 1. Registrar un Nuevo Estudiante
```bash
POST /estudiantes
{
  "id_estudiante": "1234567891",
  "nombres": "María",
  "apellidos": "López",
  "email": "maria.lopez@universidad.edu",
  "semestre_actual": 2,
  "id_usuario": "consejero-001"
}
```

### 2. Inscribir en Asignaturas
```bash
POST /inscripciones
{
  "id_estudiante": "1234567891",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01"
}
```

### 3. Registrar Calificaciones
```bash
POST /calificaciones/por-periodo
{
  "id_estudiante": "1234567891",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01",
  "tipo_evaluacion": "Parcial 1",
  "nota": 8.0
}
```

### 4. Registrar Asistencias
```bash
POST /asistencias
{
  "id_inscripcion": "insc-xxx",
  "fecha_clase": "2025-01-20",
  "estado": "Presente"
}
```

### 5. Calcular Predicción de Riesgo
```bash
POST /predicciones/calcular
{
  "id_estudiante": "1234567891"
}
```

---

## Respaldo y Restauración

### Respaldar la base de datos
```bash
# SQLite
cp backend/database/academic_prediction.db backup/academic_prediction_$(date +%Y%m%d).db

# MongoDB
mongodump --uri="mongodb://localhost:27017/academic_system" --out=backup/mongodb_$(date +%Y%m%d)
```

### Restaurar desde respaldo
```bash
# SQLite
cp backup/academic_prediction_20250122.db backend/database/academic_prediction.db

# MongoDB
mongorestore --uri="mongodb://localhost:27017/academic_system" backup/mongodb_20250122/academic_system
```

---

## Consideraciones de Seguridad

1. **Contraseñas**: Todas las contraseñas deben estar hasheadas con bcrypt
2. **Autenticación**: Usar JWT para todas las peticiones API
3. **Roles**: Validar permisos según el rol del usuario
4. **Auditoría**: Todas las operaciones se registran en MongoDB
5. **Validación**: Validar datos de entrada con DTOs y class-validator

---

## Solución de Problemas

### La base de datos no se inicializa
```bash
# Verificar que existe la carpeta
mkdir -p backend/database

# Reiniciar el backend
cd backend
npm run start:dev
```

### Error de permisos en SQLite
```bash
# Dar permisos de escritura
chmod 666 backend/database/academic_prediction.db
chmod 777 backend/database
```

### MongoDB no conecta
```bash
# Verificar que está corriendo
mongod --version

# Iniciar MongoDB
mongod --dbpath=./backend/database/mongodb
```

---

## Recursos Adicionales

- [Documentación TypeORM](https://typeorm.io/)
- [Documentación SQLite](https://www.sqlite.org/docs.html)
- [Documentación MongoDB](https://docs.mongodb.com/)
- [Documentación NestJS](https://docs.nestjs.com/)

Para más detalles sobre la estructura de la base de datos, consultar: [ESTRUCTURA_BASE_DATOS.md](./ESTRUCTURA_BASE_DATOS.md)
