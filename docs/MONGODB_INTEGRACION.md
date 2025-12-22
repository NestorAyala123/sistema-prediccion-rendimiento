# Integración de MongoDB en el Sistema

## 🎯 Descripción

Se ha implementado MongoDB como base de datos NoSQL complementaria al sistema existente (SQLite/TypeORM). MongoDB se usa para datos no estructurados, logs, análisis y predicciones, mientras que SQLite/TypeORM maneja datos relacionales (estudiantes, calificaciones, etc.).

## 📊 Arquitectura de Base de Datos Híbrida

### SQLite (TypeORM) - Base de Datos Relacional
**Uso:** Datos estructurados y transaccionales
- Usuarios
- Estudiantes
- Asignaturas
- Inscripciones
- Calificaciones
- Asistencias

### MongoDB (Mongoose) - Base de Datos NoSQL
**Uso:** Datos no estructurados, logs y análisis
- Auditoría de acciones
- Análisis de predicciones
- Estadísticas agregadas
- Logs del sistema
- Datos de ML/IA

## 🚀 Instalación

### 1. Instalar MongoDB

#### Windows
```bash
# Descargar desde: https://www.mongodb.com/try/download/community
# O usar Chocolatey:
choco install mongodb

# Iniciar servicio
net start MongoDB
```

#### Linux/Mac
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Mac con Homebrew
brew install mongodb-community

# Iniciar servicio
sudo systemctl start mongod
```

### 2. Instalar Dependencias del Proyecto

```bash
cd backend
npm install
```

Esto instalará:
- `@nestjs/mongoose` - Integración de Mongoose con NestJS
- `mongoose` - ODM para MongoDB

### 3. Configurar Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/academic_prediction
```

Para MongoDB Atlas (nube):
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/academic_prediction?retryWrites=true&w=majority
```

## 📁 Schemas de MongoDB

### 1. Auditoría (auditoria.schema.ts)
Registra todas las acciones de los usuarios en el sistema.

**Campos:**
```typescript
{
  usuario_id: string,
  usuario_email: string,
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW',
  modulo: string,
  datos_anteriores?: any,
  datos_nuevos?: any,
  ip_address?: string,
  user_agent?: string,
  fecha: Date,
  metadata?: any
}
```

### 2. Predicción Análisis (prediccion-analisis.schema.ts)
Almacena resultados detallados de predicciones de ML.

**Campos:**
```typescript
{
  estudiante_id: string,
  periodo_academico: string,
  modelo_usado: string,
  nivel_riesgo: 'Alto' | 'Medio' | 'Bajo',
  probabilidad_riesgo: number,
  factores_riesgo: object,
  recomendaciones: string[],
  datos_entrada: any,
  metricas_modelo: object,
  tiempo_procesamiento_ms: number,
  fecha_prediccion: Date
}
```

### 3. Estadísticas (estadistica.schema.ts)
Almacena estadísticas agregadas del sistema.

**Campos:**
```typescript
{
  tipo: string,
  periodo_academico: string,
  asignatura_id?: string,
  datos: {
    total_estudiantes: number,
    promedio_general: number,
    tasa_aprobacion: number,
    // ... más métricas
  },
  distribucion?: array,
  fecha_calculo: Date
}
```

## 🔌 Endpoints de API

### Auditoría

#### GET `/auditoria`
Obtener todas las auditorías (solo admin)

**Query params:**
- `page` - Número de página (default: 1)
- `limit` - Registros por página (default: 50)
- `usuario_id` - Filtrar por usuario
- `accion` - Filtrar por acción
- `modulo` - Filtrar por módulo
- `fecha_desde` - Fecha inicio (ISO)
- `fecha_hasta` - Fecha fin (ISO)

**Respuesta:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "pages": 3
}
```

#### GET `/auditoria/usuario/:id`
Obtener auditorías de un usuario específico

#### GET `/auditoria/modulo/:modulo`
Obtener auditorías por módulo

#### GET `/auditoria/estadisticas`
Obtener estadísticas de auditoría

**Respuesta:**
```json
{
  "por_accion": [
    { "_id": "CREATE", "total": 45 },
    { "_id": "UPDATE", "total": 32 }
  ],
  "por_modulo": [
    { "_id": "estudiantes", "total": 67 },
    { "_id": "calificaciones", "total": 43 }
  ]
}
```

#### POST `/auditoria/limpiar?dias=90`
Eliminar auditorías antiguas (solo admin)

## 💻 Uso en el Código

### Registrar Auditoría

```typescript
import { AuditoriaService } from './modules/auditoria/auditoria.service';

constructor(private auditoriaService: AuditoriaService) {}

async algunaAccion() {
  // ... tu lógica ...
  
  await this.auditoriaService.registrar({
    usuario_id: user.id,
    usuario_email: user.email,
    accion: 'CREATE',
    modulo: 'estudiantes',
    datos_nuevos: { ... },
    ip_address: request.ip,
    user_agent: request.headers['user-agent'],
  });
}
```

### Consultar Auditorías

```typescript
// Obtener últimas 50 auditorías de un usuario
const auditorias = await this.auditoriaService.findByUsuario(userId, 50);

// Obtener con filtros y paginación
const resultado = await this.auditoriaService.findAll(
  1, // página
  50, // límite
  {
    usuario_id: 'uuid',
    accion: 'CREATE',
    fecha_desde: new Date('2025-01-01'),
    fecha_hasta: new Date('2025-12-31'),
  }
);
```

## 🔧 Configuración Avanzada

### Cambiar URI de MongoDB

En `mongodb.config.ts`:

```typescript
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_prediction',
  options: {
    retryWrites: true,
    w: 'majority',
  },
};
```

### Configuración por Entorno

```typescript
import { getMongoConfig } from './database/mongodb.config';

MongooseModule.forRoot(
  getMongoConfig(process.env.NODE_ENV).uri,
  getMongoConfig(process.env.NODE_ENV).options
);
```

## 📊 Índices de MongoDB

Los schemas incluyen índices para optimizar búsquedas:

```typescript
// En auditoria.schema.ts
AuditoriaSchema.index({ usuario_id: 1, fecha: -1 });
AuditoriaSchema.index({ accion: 1, fecha: -1 });
AuditoriaSchema.index({ modulo: 1, fecha: -1 });
```

## 🛠️ Comandos Útiles de MongoDB

### Conectar a MongoDB
```bash
mongo
# O con MongoDB Compass (GUI)
```

### Ver Bases de Datos
```javascript
show dbs
```

### Usar Base de Datos
```javascript
use academic_prediction
```

### Ver Colecciones
```javascript
show collections
```

### Consultar Documentos
```javascript
db.auditorias.find().limit(10)
db.auditorias.countDocuments()
db.auditorias.find({ accion: 'CREATE' })
```

### Eliminar Colección
```javascript
db.auditorias.drop()
```

## 🔐 Seguridad

### Autenticación de MongoDB

En producción, habilitar autenticación:

```javascript
// Crear usuario admin
use admin
db.createUser({
  user: "admin",
  pwd: "password_seguro",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

// Crear usuario para la aplicación
use academic_prediction
db.createUser({
  user: "app_user",
  pwd: "password_seguro",
  roles: [ { role: "readWrite", db: "academic_prediction" } ]
})
```

URI con autenticación:
```
mongodb://app_user:password@localhost:27017/academic_prediction?authSource=academic_prediction
```

## 🚀 Despliegue

### MongoDB Atlas (Nube)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Configurar IP whitelist
4. Obtener connection string
5. Actualizar `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/academic_prediction?retryWrites=true&w=majority
```

## 📈 Monitoreo

### Ver Estadísticas de la Base de Datos

```javascript
db.stats()
```

### Ver Operaciones Activas

```javascript
db.currentOp()
```

### Perfilar Consultas

```javascript
db.setProfilingLevel(2)
db.system.profile.find().limit(10).sort({ ts: -1 })
```

## 🔄 Migración de Datos

Si necesitas migrar datos existentes:

```typescript
// Ejemplo: Migrar auditorías de SQL a MongoDB
async migrateAuditorias() {
  const sqlAuditorias = await this.sqlRepository.find();
  
  for (const auditoria of sqlAuditorias) {
    await this.auditoriaService.registrar({
      usuario_id: auditoria.usuario_id,
      usuario_email: auditoria.email,
      accion: auditoria.accion,
      modulo: auditoria.modulo,
      fecha: auditoria.created_at,
    });
  }
}
```

## ✅ Ventajas de la Arquitectura Híbrida

1. **Flexibilidad**: SQL para datos estructurados, NoSQL para datos flexibles
2. **Escalabilidad**: MongoDB escala horizontalmente
3. **Performance**: Cada DB optimizada para su caso de uso
4. **Auditoría**: Logs separados no afectan BD transaccional
5. **Análisis**: MongoDB ideal para big data y ML

## 📝 Próximos Pasos

- [ ] Implementar módulo de predicciones con MongoDB
- [ ] Crear dashboard de estadísticas
- [ ] Implementar backup automático
- [ ] Configurar réplicas de MongoDB
- [ ] Agregar más schemas según necesidad

---

**Estado**: ✅ MongoDB integrado y funcional
**Fecha**: Diciembre 22, 2025
