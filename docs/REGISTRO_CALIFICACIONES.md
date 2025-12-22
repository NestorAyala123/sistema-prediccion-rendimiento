# Sistema de Registro de Calificaciones por Periodo Académico

## 📋 Descripción

Sistema completo para registrar y gestionar calificaciones de estudiantes organizadas por **periodo académico** y **asignatura**. Permite a docentes y administradores registrar notas de diferentes tipos de evaluaciones (parciales, exámenes, deberes, etc.) y hacer seguimiento del rendimiento académico.

## 🎯 Características Implementadas

### Backend (NestJS)

#### Módulo de Calificaciones
- ✅ CRUD completo de calificaciones
- ✅ Registro por inscripción directa
- ✅ Registro simplificado por periodo y materia (crea inscripción automáticamente)
- ✅ Consultas por estudiante
- ✅ Consultas por periodo académico
- ✅ Consultas por asignatura y periodo
- ✅ Cálculo automático de promedios
- ✅ Protección por roles (administrador, docente)

#### Módulo de Asignaturas
- ✅ CRUD completo de asignaturas
- ✅ Gestión de códigos de materia
- ✅ Gestión de créditos
- ✅ Protección por roles

### Frontend (React + TypeScript)

#### Componente RegistroCalificaciones
- ✅ Filtros por periodo académico y asignatura
- ✅ Formulario de registro de calificaciones
- ✅ Selección de estudiante y tipo de evaluación
- ✅ Validación de notas (0-100)
- ✅ Tabla de calificaciones por estudiante
- ✅ Visualización de promedios
- ✅ Indicadores visuales por nivel de rendimiento
- ✅ Diseño responsive

## 🗂️ Estructura de Base de Datos

### Tabla: inscripciones
```sql
- id_inscripcion (UUID)
- id_estudiante (FK)
- id_asignatura (FK)
- periodo_academico (VARCHAR) -- Ej: "2025-01", "2025-02"
```

### Tabla: calificaciones
```sql
- id_calificacion (UUID)
- id_inscripcion (FK)
- tipo_evaluacion (VARCHAR) -- "Parcial 1", "Deber", etc.
- nota (DECIMAL)
- fecha_registro (DATETIME)
```

### Tabla: asignaturas
```sql
- id_asignatura (VARCHAR) -- Código: "MAT-101"
- nombre_asignatura (VARCHAR)
- creditos (INTEGER)
```

## 🚀 Endpoints de API

### Calificaciones

#### POST `/calificaciones/por-periodo`
Registrar calificación por periodo y materia (método simplificado)

**Body:**
```json
{
  "id_estudiante": "EST-001",
  "id_asignatura": "MAT-101",
  "periodo_academico": "2025-01",
  "tipo_evaluacion": "Parcial 1",
  "nota": 85.5
}
```

**Respuesta:**
```json
{
  "id_calificacion": "uuid",
  "id_inscripcion": "uuid",
  "tipo_evaluacion": "Parcial 1",
  "nota": 85.5,
  "fecha_registro": "2025-01-15T10:30:00Z"
}
```

#### GET `/calificaciones/estudiante/:id`
Obtener todas las calificaciones de un estudiante agrupadas por periodo y asignatura

**Respuesta:**
```json
[
  {
    "periodo_academico": "2025-01",
    "asignatura": "Matemáticas I",
    "id_asignatura": "MAT-101",
    "creditos": 4,
    "calificaciones": [
      {
        "id_calificacion": "uuid",
        "tipo_evaluacion": "Parcial 1",
        "nota": 85,
        "fecha_registro": "2025-01-15"
      }
    ],
    "promedio": 85
  }
]
```

#### GET `/calificaciones/periodo/:periodo`
Obtener todas las calificaciones de un periodo académico

#### GET `/calificaciones/asignatura/:id_asignatura/periodo/:periodo`
Obtener calificaciones de una asignatura específica en un periodo

**Respuesta:**
```json
[
  {
    "estudiante": {
      "id": "EST-001",
      "nombres": "Juan",
      "apellidos": "Pérez",
      "email": "juan@test.com"
    },
    "calificaciones": [
      {
        "id_calificacion": "uuid",
        "tipo_evaluacion": "Parcial 1",
        "nota": 85,
        "fecha_registro": "2025-01-15"
      }
    ],
    "promedio": 85
  }
]
```

#### GET `/calificaciones/promedio/estudiante/:id/periodo/:periodo`
Obtener promedio general de un estudiante en un periodo

**Respuesta:**
```json
{
  "promedio": 87.5
}
```

#### PUT `/calificaciones/:id`
Actualizar una calificación

**Body:**
```json
{
  "nota": 90,
  "tipo_evaluacion": "Parcial 1 - Corrección"
}
```

#### DELETE `/calificaciones/:id`
Eliminar una calificación

### Asignaturas

#### GET `/asignaturas`
Obtener todas las asignaturas

#### POST `/asignaturas`
Crear nueva asignatura

**Body:**
```json
{
  "id_asignatura": "MAT-101",
  "nombre_asignatura": "Matemáticas I",
  "creditos": 4
}
```

#### PUT `/asignaturas/:id`
Actualizar asignatura

#### DELETE `/asignaturas/:id`
Eliminar asignatura

## 🎨 Tipos de Evaluación Disponibles

- Parcial 1
- Parcial 2
- Parcial 3
- Examen Final
- Deber
- Proyecto
- Participación
- Laboratorio
- Exposición

## 📊 Formato de Periodo Académico

Los periodos académicos siguen el formato: `YYYY-MM`

Ejemplos:
- `2025-01` - Enero a Mayo 2025
- `2025-02` - Junio a Octubre 2025
- `2024-02` - Junio a Octubre 2024

## 🔐 Permisos por Rol

### Administrador
- ✅ Ver todas las calificaciones
- ✅ Registrar calificaciones
- ✅ Editar calificaciones
- ✅ Eliminar calificaciones
- ✅ Gestionar asignaturas
- ✅ Ver reportes completos

### Docente
- ✅ Ver calificaciones de sus asignaturas
- ✅ Registrar calificaciones en sus asignaturas
- ✅ Editar calificaciones que registró
- ✅ Ver estadísticas de sus estudiantes

### Estudiante
- ✅ Ver sus propias calificaciones
- ✅ Ver su promedio por periodo
- ✅ Ver su historial académico

## 📱 Uso del Sistema

### Para Docentes

1. **Acceder al módulo de calificaciones**
   - Desde el dashboard docente, clic en "Registrar Calificaciones"

2. **Seleccionar periodo y asignatura**
   - Elegir el periodo académico (ej: 2025-01)
   - Seleccionar la asignatura a evaluar

3. **Registrar calificación**
   - Clic en "Nueva Calificación"
   - Seleccionar estudiante
   - Elegir tipo de evaluación
   - Ingresar nota (0-100)
   - Guardar

4. **Ver resultados**
   - La tabla muestra todos los estudiantes
   - Se visualiza el promedio automáticamente
   - Colores indican el nivel de rendimiento

### Para Administradores

1. **Gestionar asignaturas**
   - Crear nuevas asignaturas con su código
   - Definir créditos
   - Actualizar información

2. **Supervisar calificaciones**
   - Acceso a todas las asignaturas y periodos
   - Ver reportes completos
   - Editar o eliminar según necesidad

3. **Análisis por periodo**
   - Filtrar por periodo académico
   - Ver rendimiento general
   - Identificar tendencias

## 🎯 Indicadores Visuales

### Colores de Rendimiento

- 🟢 **Verde** (80-100): Excelente rendimiento
- 🟡 **Amarillo** (60-79): Rendimiento aceptable
- 🔴 **Rojo** (0-59): Rendimiento bajo - Requiere atención

## 📂 Archivos Creados

### Backend
```
backend/src/modules/
├── calificaciones/
│   ├── calificaciones.controller.ts
│   ├── calificaciones.service.ts
│   ├── calificaciones.module.ts
│   └── dto/
│       └── calificacion.dto.ts
└── asignaturas/
    ├── asignaturas.controller.ts
    ├── asignaturas.service.ts
    ├── asignaturas.module.ts
    └── dto/
        └── asignatura.dto.ts
```

### Frontend
```
frontend/src/
├── components/
│   └── RegistroCalificaciones.tsx
└── services/
    └── api.ts (actualizado)
```

## 🔄 Flujo de Registro

1. **Docente selecciona periodo y materia**
2. **Sistema busca inscripciones existentes**
3. **Si no existe inscripción, se crea automáticamente**
4. **Se registra la calificación vinculada a la inscripción**
5. **Se calcula el promedio automáticamente**
6. **Se actualiza la visualización en tiempo real**

## 💡 Ventajas del Sistema

1. **Organización por periodo**: Fácil seguimiento histórico
2. **Creación automática de inscripciones**: Simplifica el registro
3. **Múltiples tipos de evaluación**: Flexibilidad pedagógica
4. **Cálculo automático de promedios**: Ahorra tiempo
5. **Visualización clara**: Identificación rápida de problemas
6. **Protección por roles**: Seguridad de datos
7. **Responsive**: Funciona en cualquier dispositivo

## 🚀 Próximas Mejoras

- [ ] Exportar calificaciones a Excel/PDF
- [ ] Gráficos de rendimiento por periodo
- [ ] Notificaciones de calificaciones bajas
- [ ] Importación masiva de calificaciones
- [ ] Configuración de pesos por tipo de evaluación
- [ ] Histórico de modificaciones
- [ ] Comparativas entre periodos
- [ ] Reporte de progreso del estudiante

## 📝 Ejemplo de Uso

```typescript
// Registrar calificación
const calificacion = await calificacionesService.createPorPeriodo({
  id_estudiante: 'EST-001',
  id_asignatura: 'MAT-101',
  periodo_academico: '2025-01',
  tipo_evaluacion: 'Parcial 1',
  nota: 85.5
});

// Obtener calificaciones de un estudiante
const calificaciones = await calificacionesService.findByEstudiante('EST-001');

// Obtener promedio
const promedio = await calificacionesService.getPromedioEstudiantePeriodo(
  'EST-001',
  '2025-01'
);
```

---

**Estado**: ✅ Sistema completamente funcional
**Fecha**: Diciembre 22, 2025
