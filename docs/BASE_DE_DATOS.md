# 💾 Configuración de Base de Datos

## 📊 Base de Datos Actual: SQLite

El sistema utiliza **SQLite** como base de datos, lo que significa:

✅ **Ventajas:**
- No requiere instalación de servidor de base de datos
- Archivo único y portátil
- Perfecto para desarrollo y demos
- Configuración cero

📁 **Ubicación del archivo:**
```
backend/database/academic_prediction.db
```

## 🔧 Configuración

### Archivo: `backend/src/database/database.config.ts`

```typescript
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/academic_prediction.db',
  entities: [ /* ... */ ],
  synchronize: true,  // Auto-crea tablas
  logging: true,      // Muestra queries SQL
};
```

## 📋 Tablas Creadas Automáticamente

Cuando inicias el backend, TypeORM crea automáticamente:

1. **usuarios** - Cuentas de acceso al sistema
2. **estudiantes** - Información de estudiantes
3. **asignaturas** - Materias/cursos
4. **inscripciones** - Relación estudiante-asignatura
5. **calificaciones** - Notas y evaluaciones
6. **asistencias** - Registro de asistencia
7. **habitos_estudio** - Hábitos y patrones de estudio
8. **predicciones_riesgo** - Predicciones generadas

## 🚀 Inicio con Base de Datos

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecuta el script que inicia backend + frontend
INICIAR-COMPLETO.bat
```

Este script:
1. ✅ Verifica que exista el directorio `backend/database/`
2. ✅ Crea el directorio si no existe
3. ✅ Inicia el backend (crea la BD automáticamente)
4. ✅ Inicia el frontend

### Opción 2: Manual

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## 📊 Verificar que los Datos se Guardan

### 1. Crear un estudiante en el frontend

```
1. Abre http://localhost:3000
2. Login con cualquier email/password
3. Ve a "Estudiantes"
4. Clic en "Agregar Estudiante"
5. Llena el formulario
6. Guarda
```

### 2. Verificar en consola del backend

Deberías ver en la ventana del backend:

```sql
query: INSERT INTO "estudiantes" (...)
```

### 3. Verificar archivo de base de datos

Revisa que existe:
```
backend/database/academic_prediction.db
```

El tamaño del archivo aumentará conforme agregues datos.

## 🔍 Herramientas para Ver los Datos

### Opción 1: DB Browser for SQLite (Recomendado)
- Descarga: https://sqlitebrowser.org/
- Abre el archivo `academic_prediction.db`
- Navega por las tablas visualmente

### Opción 2: Extensión de VS Code
1. Instala "SQLite Viewer" en VS Code
2. Abre el archivo `.db`
3. Explora las tablas

### Opción 3: Línea de comandos
```bash
# Abrir SQLite
sqlite3 backend/database/academic_prediction.db

# Listar tablas
.tables

# Ver estudiantes
SELECT * FROM estudiantes;

# Salir
.quit
```

## 🔄 Sincronización Automática

**`synchronize: true`** significa:
- TypeORM crea las tablas automáticamente
- Actualiza el esquema cuando cambias las entidades
- **⚠️ ADVERTENCIA:** En producción usar `false` y migraciones

## 📝 Entidades Definidas

Ubicación: `backend/src/entities/`

```
estudiante.entity.ts     → Tabla: estudiantes
usuario.entity.ts        → Tabla: usuarios
asignatura.entity.ts     → Tabla: asignaturas
calificacion.entity.ts   → Tabla: calificaciones
asistencia.entity.ts     → Tabla: asistencias
habito-estudio.entity.ts → Tabla: habitos_estudio
prediccion-riesgo.entity.ts → Tabla: predicciones_riesgo
inscripcion.entity.ts    → Tabla: inscripciones
```

## 🛠️ Solución de Problemas

### ❌ Error: "SQLITE_CANTOPEN: unable to open database file"

**Solución:**
```bash
# Crear directorio manualmente
mkdir backend\database
```

### ❌ Error: "database is locked"

**Solución:**
1. Cierra DB Browser si está abierto
2. Reinicia el backend

### ❌ Los datos no se guardan

**Verificar:**
1. ✅ Backend está corriendo en puerto 4000
2. ✅ Frontend apunta a `http://localhost:4000`
3. ✅ No hay errores en consola del backend
4. ✅ Archivo `frontend/src/services/api.ts` NO tiene fallbacks de localStorage

### ❌ Quiero empezar de cero

```bash
# Detén el backend
# Elimina la base de datos
del backend\database\academic_prediction.db

# Reinicia el backend - se creará una BD nueva vacía
```

## 🔐 Variables de Entorno

Archivo: `backend/.env`

```env
PORT=4000
JWT_SECRET=tu-secreto-aqui
```

**No requiere configuración de PostgreSQL/MySQL.**

## 📈 Migrar a PostgreSQL (Futuro)

Si necesitas PostgreSQL en producción:

1. Instalar PostgreSQL
2. Crear base de datos
3. Actualizar `database.config.ts`:

```typescript
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'tu-password',
  database: 'academic_prediction',
  entities: [...],
  synchronize: false, // Usar migraciones
};
```

4. Actualizar `.env`:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password
DB_DATABASE=academic_prediction
```

## ✅ Resumen

| Aspecto | Estado Actual |
|---------|---------------|
| **Tipo de BD** | SQLite |
| **Ubicación** | `backend/database/academic_prediction.db` |
| **Auto-creación** | ✅ Sí (synchronize: true) |
| **Persistencia** | ✅ Archivo local |
| **Requiere servidor** | ❌ No |
| **Producción** | ⚠️ Considerar PostgreSQL |

---

**🎯 Próximos pasos:**
1. Ejecuta `INICIAR-COMPLETO.bat`
2. Crea estudiantes desde el frontend
3. Verifica que se guardan en el archivo `.db`
4. Explora los datos con DB Browser

**¿Necesitas ayuda?** Revisa los logs en la ventana del backend.
