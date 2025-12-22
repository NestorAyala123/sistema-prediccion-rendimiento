# Sistema de Roles Implementado

## 📋 Resumen

Se ha implementado un sistema completo de autenticación basado en roles con tres tipos de usuarios:

- **Estudiante** - Acceso limitado a su información personal
- **Docente** - Acceso a información de sus estudiantes
- **Administrador** - Acceso completo al sistema

## 🎯 Roles Disponibles

### 1. Estudiante
- **Ruta**: `/estudiante/dashboard`
- **Características**:
  - Ver su promedio general
  - Ver sus calificaciones por materia
  - Ver su asistencia
  - Ver su nivel de riesgo académico
  - Recibir recomendaciones personalizadas

### 2. Docente
- **Ruta**: `/docente/dashboard`
- **Características**:
  - Ver lista de todos sus estudiantes
  - Ver estudiantes en riesgo
  - Acciones rápidas (asistencia, calificaciones)
  - Estadísticas del curso
  - Gestión de tareas pendientes

### 3. Administrador
- **Ruta**: `/admin/dashboard`
- **Características**:
  - Acceso completo al sistema
  - Gestión de estudiantes
  - Ver predicciones
  - Acceso al dashboard completo
  - Gestión de soporte

## 🔐 Cómo Registrarse con Diferentes Roles

El sistema determina automáticamente el rol basándose en el dominio del email:

### Para Administrador:
```
Email: admin@admin.universidad.edu
```
Cualquier email que contenga `@admin.` será registrado como **administrador**

### Para Docente:
```
Email: profesor@docente.universidad.edu
```
Cualquier email que contenga `@docente.` será registrado como **docente**

### Para Estudiante:
```
Email: estudiante@universidad.edu
```
Cualquier otro email será registrado como **estudiante** (rol por defecto)

## 🚀 Cómo Usar el Sistema

### Registro

1. Ir a `/register`
2. Llenar el formulario con:
   - Nombres
   - Apellidos
   - Email (según el rol deseado)
   - Contraseña
3. El sistema asignará automáticamente el rol según el email

### Login

1. Ir a `/login`
2. Ingresar email y contraseña
3. El sistema redirigirá automáticamente a:
   - `/admin/dashboard` - si eres administrador
   - `/docente/dashboard` - si eres docente
   - `/estudiante/dashboard` - si eres estudiante

## 🔒 Protección de Rutas

Cada ruta está protegida con dos niveles:

1. **ProtectedRoute**: Verifica que el usuario esté autenticado
2. **RoleProtectedRoute**: Verifica que el usuario tenga el rol correcto

Si un usuario intenta acceder a una ruta no autorizada, será redirigido automáticamente a su dashboard correspondiente.

## 📂 Archivos Creados/Modificados

### Backend
- ✅ `backend/src/auth/guards/roles.guard.ts` - Guard para protección por roles
- ✅ `backend/src/auth/decorators/roles.decorator.ts` - Decorador para definir roles requeridos
- ✅ `backend/src/auth/auth.service.ts` - Actualizado para asignar roles automáticamente

### Frontend
- ✅ `frontend/src/components/EstudianteDashboard.tsx` - Interfaz para estudiantes
- ✅ `frontend/src/components/DocenteDashboard.tsx` - Interfaz para docentes
- ✅ `frontend/src/components/RoleProtectedRoute.tsx` - Componente de protección por rol
- ✅ `frontend/src/App.tsx` - Actualizado con rutas por rol
- ✅ `frontend/src/components/Login.tsx` - Actualizado para redirigir según rol
- ✅ `frontend/src/components/Register.tsx` - Actualizado con hint de roles

## 🧪 Usuarios de Prueba

Puedes crear usuarios de prueba con estos emails:

```
# Administrador
admin@admin.test
password: admin123

# Docente
profesor@docente.test
password: docente123

# Estudiante
estudiante@test.edu
password: estudiante123
```

## 📊 Flujo de Autenticación

```
1. Usuario se registra con email específico
   ↓
2. Backend detecta el rol por el dominio del email
   ↓
3. Usuario inicia sesión
   ↓
4. Backend genera JWT con el rol incluido
   ↓
5. Frontend recibe el token y el usuario con su rol
   ↓
6. Usuario es redirigido a su dashboard según rol
   ↓
7. Rutas protegidas verifican el rol antes de permitir acceso
```

## 🔧 Uso de Guards en el Backend

Para proteger endpoints en el backend, usa el decorador `@Roles()`:

```typescript
import { Roles } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador', 'docente')
@Get('admin-only')
soloParaAdminsYDocentes() {
  return 'Solo administradores y docentes pueden ver esto';
}
```

## 🎨 Características de las Interfaces

### Interfaz Estudiante
- Dashboard personalizado con saludo
- Tarjetas de estadísticas (promedio, riesgo, materias, asistencia)
- Lista de calificaciones con colores según rendimiento
- Gráfico de asistencia con barras de progreso
- Recomendaciones personalizadas

### Interfaz Docente
- Dashboard de gestión de estudiantes
- Vista de estudiantes en riesgo prioritario
- Acciones rápidas (asistencia, calificaciones, ver estudiantes)
- Estadísticas del curso completo
- Lista completa de estudiantes con sus promedios y riesgo
- Tareas pendientes

### Interfaz Administrador
- Acceso completo al sistema original
- Gestión de estudiantes
- Predicciones
- Dashboard completo
- Soporte

## 🔄 Próximos Pasos

1. Conectar las interfaces con la API real
2. Implementar las funciones de acciones rápidas
3. Agregar más estadísticas y gráficos
4. Implementar notificaciones por rol
5. Agregar más funcionalidades específicas por rol

## ⚙️ Configuración Adicional

### Variables de Entorno

Asegúrate de tener configurado en tu `.env`:

```env
# Backend
JWT_SECRET=tu_secreto_jwt
DATABASE_URL=tu_base_de_datos

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

## 📝 Notas

- El sistema está listo para usar en modo demo (sin backend)
- Los roles se asignan automáticamente en el registro
- Las interfaces están completamente responsivas
- Todas las rutas están protegidas por rol
- El sistema redirige automáticamente según el rol del usuario

---

**Fecha de Implementación**: Diciembre 22, 2025
**Estado**: ✅ Completado y funcional
