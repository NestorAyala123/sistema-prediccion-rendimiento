# 🧪 Guía de Pruebas - Testing de la Aplicación

## 📌 Objetivo

Verificar que la aplicación funciona correctamente en **modo demo** (sin backend) y que está lista para la implementación de endpoints reales.

---

## 🚀 Paso 1: Iniciar la Aplicación

### Opción A: Automática (Recomendado)

```powershell
cd "C:\Users\HP\OneDrive - ULEAM\Escritorio\predipcion\sistema-prediccion-rendimiento"
.\instalar.ps1
# Selecciona: 4 (Arrancar ambos en paralelo)
```

### Opción B: Manual

**Terminal 1** (Backend):

```powershell
cd backend
npm run start:dev
# Espera a ver: "Nest application successfully started on port 3001"
```

**Terminal 2** (Frontend):

```powershell
cd frontend
npm start
# Espera a ver: "Compiled successfully"
```

---

## ✅ Prueba 1: Verificar Que el Frontend Compila

**Esperado en Terminal 2**:

```
Compiled successfully!

You can now view sistema-prediccion-rendimiento in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

**⚠️ Sin Warnings** sobre React Router

**Si ves warnings**:

- ❌ Los future flags no se agregaron correctamente
- Revisa que `App.tsx` incluya:
  ```tsx
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  ```

---

## ✅ Prueba 2: Acceder a la Aplicación

### Abre el navegador

1. Ve a **http://localhost:3000**
2. Deberías ver la pantalla de **Login**

**Elementos esperados**:

- ✅ Título: "Sistema de Predicción"
- ✅ Subtítulo: "Predicción de Rendimiento Académico"
- ✅ Campo de email
- ✅ Campo de contraseña
- ✅ Botón "Iniciar Sesión"
- ✅ Enlace "¿No tienes cuenta? Regístrate"

---

## ✅ Prueba 3: Registrar un Usuario Nuevo

### Haz clic en "Regístrate"

1. Ve a **http://localhost:3000/register**
2. Completa el formulario:
   - Email: `usuario@test.com`
   - Nombres: `Juan`
   - Apellidos: `Pérez`
   - Contraseña: `password123`
   - Confirmar contraseña: `password123`

### Esperado:

- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Validación de coincidencia de contraseñas
- ✅ Validación de email
- ✅ Botón "Crear Cuenta" funcional

### En la Consola (F12)

Deberías ver:

```
Backend de autenticación no disponible (404), usando demo mode
```

Esto es **correcto** porque el backend aún no tiene los endpoints de autenticación.

### Después de registrarte:

- ✅ Debes ser redirigido a **http://localhost:3000/**
- ✅ Debe aparecer el Dashboard

---

## ✅ Prueba 4: Login

### Vuelve a /login

```
http://localhost:3000/login
```

### Ingresa credenciales:

- Email: cualquier valor
- Contraseña: cualquier valor

### Esperado:

- ✅ Inicia sesión exitosamente
- ✅ Redirige al Dashboard
- ✅ Muestra "Sesión iniciada correctamente" (verde)
- ✅ Mostrará tu email en la esquina superior derecha

---

## ✅ Prueba 5: Explorar el Dashboard

### Elementos principales:

1. **Navbar** (arriba)

   - ✅ Logo/Título
   - ✅ Tu email
   - ✅ Botón "Cerrar Sesión"
   - ✅ Botón "Ayuda"

2. **Sidebar** (izquierda)

   - ✅ "Dashboard" (activo, azul)
   - ✅ "Estudiantes"
   - ✅ "Predicciones"
   - ✅ Botón toggle para expandir/contraer

3. **Contenido principal** (centro)

   - ✅ Tarjetas de KPI (Estudiantes, Asistencia, Promedio, Riesgo)
   - ✅ Tabla de estudiantes recientes
   - ✅ Botón "Exportar Datos" (CSV)

4. **Footer** (abajo)
   - ✅ Información institucional
   - ✅ Enlaces a Soporte y Políticas

### Responsive:

- Abre DevTools (F12)
- Presiona Ctrl+Shift+M para modo móvil
- ✅ Sidebar debe ocultarse
- ✅ Contenido debe adaptarse
- ✅ Sin scroll horizontal

---

## ✅ Prueba 6: Gestión de Estudiantes

### Navega a "Estudiantes"

1. Haz clic en "Estudiantes" en el Sidebar
2. O ve a **http://localhost:3000/estudiantes**

### Elementos esperados:

- ✅ Tabla con estudiantes
- ✅ Columnas: ID, Nombre, Email, Carrera
- ✅ Botones de acción (ver más detalles, editar, eliminar)
- ✅ Formulario para agregar nuevo estudiante
- ✅ Validación de formulario

### Prueba crear un estudiante:

1. Completa el formulario
2. Haz clic en "Agregar Estudiante"
3. ✅ Debe aparecer en la tabla
4. ✅ El ID se genera automáticamente

---

## ✅ Prueba 7: Predicciones

### Navega a "Predicciones"

1. Haz clic en "Predicciones" en el Sidebar
2. O ve a **http://localhost:3000/predicciones**

### Elementos esperados:

- ✅ Tabla con predicciones de riesgo
- ✅ Columnas: ID, Estudiante, Riesgo %, Recomendación
- ✅ Botón "Generar Reporte" (PDF)
- ✅ Botón para generar nueva predicción

### Nota sobre reportes PDF:

- 📝 El botón "Generar Reporte" está funcional pero sin backend
- 🔄 Cuando implemente los endpoints, descargará PDFs reales

---

## ✅ Prueba 8: Exportar Datos CSV

### En el Dashboard:

1. Haz clic en "Exportar Datos"
2. ✅ Debe descargar un archivo `estudiantes-[fecha].csv`

### Verifica el archivo:

```
id,email,nombres,apellidos,carrera
1,juan@test.com,Juan,Pérez,Ingeniería
...
```

---

## ✅ Prueba 9: Logout

### En la Navbar:

1. Haz clic en "Cerrar Sesión"
2. ✅ Debes ser redirigido a **http://localhost:3000/login**
3. ✅ Todos los datos de sesión se limpian

### Verifica:

- Abre DevTools (F12) → Application → LocalStorage
- ✅ `token` y `user` deben estar vacíos

---

## ✅ Prueba 10: Rutas Protegidas

### Intenta acceder a rutas sin estar logueado:

1. Abre una pestaña nueva
2. Ve a **http://localhost:3000/estudiantes**
3. ✅ Debes ser redirigido a **/login**

Este es el comportamiento correcto porque las rutas están protegidas.

---

## 🔍 Verificación en DevTools

### Abre la Consola (F12 → Console)

**Sin errores rojo** ✅

**Warnings permitidos**:

- Mensajes de demo mode: `Backend de autenticación no disponible`
- Mensajes de development

**Errores NO permitidos** ❌:

- Errores de TypeScript
- Network errors (excepto 404 del backend)
- Uncaught exceptions

---

## 📊 Prueba 11: Almacenamiento Local

### Verifica que los datos persisten:

1. Abre DevTools → Application → LocalStorage
2. Selecciona **http://localhost:3000**
3. Deberías ver:

   - ✅ `token`: "demo-token"
   - ✅ `user`: {"email":"...","role":"usuario"}

4. Recarga la página (F5)
5. ✅ Debes seguir logueado

6. Cierra sesión
7. ✅ LocalStorage debe limpiarse

---

## 🎯 Prueba 12: Responsividad

### Desktop (1440px)

- ✅ Sidebar visible
- ✅ Contenido optimizado para pantalla grande
- ✅ Sin scroll horizontal

### Tablet (768px)

- ✅ Sidebar colapsable
- ✅ Contenido se adapta
- ✅ Botones accesibles

### Móvil (375px)

- ✅ Sidebar oculto por defecto
- ✅ Menú hamburguesa funcional
- ✅ Contenido sin scroll horizontal
- ✅ Tap targets de 44px mínimo

---

## ✅ Resumen de Pruebas

| Prueba           | Esperado                     | Estado |
| ---------------- | ---------------------------- | ------ |
| Frontend compila | Sin warnings                 | ✅     |
| Acceso a /login  | Pantalla de login visible    | ✅     |
| Registro         | Demo mode funciona           | ✅     |
| Login            | Demo mode funciona           | ✅     |
| Dashboard        | Todos los elementos visibles | ✅     |
| Estudiantes      | CRUD funcional               | ✅     |
| Predicciones     | Tabla y botones funcionales  | ✅     |
| Export CSV       | Descarga archivo             | ✅     |
| Logout           | Limpia sesión                | ✅     |
| Rutas protegidas | Redirige a login             | ✅     |
| LocalStorage     | Persiste datos               | ✅     |
| Responsividad    | Se adapta a pantalla         | ✅     |

---

## 🐛 Checklist de Bugs

Si encuentras alguno de estos, **es un bug**:

- ❌ TypeScript errors en la consola
- ❌ Errores rojos no controlados
- ❌ Layout roto en alguna resolución
- ❌ Botones que no funcionan
- ❌ Forms que aceptan datos inválidos
- ❌ Logout que no funciona
- ❌ Datos que no persisten en localStorage
- ❌ Rutas no protegidas
- ❌ Warnings de React Router

**Si encuentras alguno**: Reporta con detalles de qué pasó y en qué paso.

---

## 🎉 Éxito

Si todas las pruebas pasaron ✅, la aplicación está **lista para producción** (con backend implementado).

### Próximo paso:

Implementa los endpoints del backend según `BACKEND_AUTH_SETUP.md`

---

**Guía de Pruebas v1.0**  
**21 de Octubre de 2025**
