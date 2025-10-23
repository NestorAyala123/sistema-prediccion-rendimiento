# 🚀 Guía Completa de Instalación

## ¿Primera vez? Comienza aquí

Este documento te guiará paso a paso para instalar y ejecutar el **Sistema de Predicción de Rendimiento Académico**.

---

## ⚙️ Paso 1: Verificar Requisitos Previos

Antes de comenzar, asegúrate de tener:

### ✅ Node.js y npm

Abre **PowerShell** (Windows) o **Terminal** (Mac/Linux) y ejecuta:

```powershell
node --version
npm --version
```

**Resultados esperados:**

```
v16.0.0 (o superior)
8.0.0 (o superior)
```

**Si no tienes Node.js instalado:**

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (Long Term Support)
3. Instala siguiendo los pasos del instalador
4. Reinicia tu computadora
5. Verifica nuevamente los comandos anteriores

### ✅ Espacio en Disco

- Necesitas al menos **2 GB** de espacio libre
- Las carpetas `node_modules` ocuparán ~1.5 GB

---

## 📥 Paso 2: Descargar el Proyecto

### Opción A: Si tienes Git instalado

```powershell
git clone https://github.com/NestorAyala123/sistema-prediccion-rendimiento.git
cd sistema-prediccion-rendimiento
```

### Opción B: Si NO tienes Git

1. Ve a: https://github.com/NestorAyala123/sistema-prediccion-rendimiento
2. Haz clic en **"Code"** → **"Download ZIP"**
3. Extrae el archivo en tu carpeta deseada
4. Abre PowerShell en esa carpeta

---

## 🔧 Paso 3: Instalación (Método Automático - Recomendado)

### En Windows PowerShell:

```powershell
# 1. Navega a la carpeta del proyecto
cd "C:\ruta\al\proyecto\sistema-prediccion-rendimiento"

# 2. Ejecuta el script de instalación
.\instalar.ps1

# 3. Si ves un error sobre "permisos de ejecución", ejecuta esto como ADMINISTRADOR:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Luego vuelve a ejecutar:
.\instalar.ps1

# 5. Selecciona la opción: 4 (Instalar todo)
```

**El script hará automáticamente:**

- ✅ Instalar dependencias del backend
- ✅ Instalar dependencias del frontend
- ✅ Crear la base de datos
- ✅ Iniciar ambos servidores

---

## 🔧 Paso 4: Instalación Manual (Si el script no funciona)

### 4.1 Instalar Backend

```powershell
# Abre PowerShell en la raíz del proyecto
cd backend

# Instala las dependencias
npm install

# Espera a que termine (2-5 minutos)
# Verás: "added XXX packages"
```

**Dependencias que se instalarán:**

- `@nestjs/common` - Framework core
- `@nestjs/core` - Runtime
- `@nestjs/typeorm` - Base de datos
- `sqlite3` - Driver SQLite ⭐
- `@nestjs/jwt` - Autenticación
- `bcrypt` - Encriptación
- `typeorm` - ORM
- Más...

### 4.2 Instalar Frontend

```powershell
# Desde la raíz del proyecto
cd frontend

# Instala las dependencias
npm install

# Espera a que termine (3-5 minutos)
```

**Dependencias que se instalarán:**

- `react` - Librería UI ⭐
- `react-router-dom` - Enrutamiento
- `axios` - Cliente HTTP
- `tailwindcss` - Estilos CSS ⭐
- `typescript` - Tipado
- Más...

---

## ▶️ Paso 5: Iniciar la Aplicación

### 5.1 Iniciar Backend

Abre una **ventana NEW de PowerShell**:

```powershell
# Navega a la carpeta backend
cd "C:\ruta\al\proyecto\sistema-prediccion-rendimiento\backend"

# Inicia en modo desarrollo
npm run start:dev

# Espera hasta ver este mensaje:
# "🚀 Backend ejecutándose en http://localhost:3001"
```

**NO CIERRES esta ventana** - mantén el backend corriendo.

### 5.2 Iniciar Frontend

Abre una **SEGUNDA ventana de PowerShell**:

```powershell
# Navega a la carpeta frontend
cd "C:\ruta\al\proyecto\sistema-prediccion-rendimiento\frontend"

# Inicia en modo desarrollo
npm start

# Se abrirá automáticamente: http://localhost:3000
# Si no se abre, ve a: http://localhost:3000 en tu navegador
```

---

## ✅ Verificar que Todo Funciona

Deberías ver:

1. **Frontend** (http://localhost:3000)

   - ✅ Página de login
   - ✅ Puedes navegar por el menú
   - ✅ Modo oscuro funciona
   - ✅ Idiomas ES/EN funcionan

2. **Backend** (http://localhost:3001)

   - ✅ Terminal muestra "Backend ejecutándose"
   - ✅ Registros de operaciones en la terminal

3. **Base de Datos**
   - ✅ Archivo creado: `backend/database/academic_prediction.db`

---

## 🎮 Probar la Aplicación

### Paso 1: Login

```
Email: cualquiera (ej: test@test.com)
Contraseña: cualquiera (ej: 123456)
```

### Paso 2: Agregar Estudiante

1. Ve a **Estudiantes**
2. Haz clic en **"Agregar estudiante"**
3. Completa:
   - **ID**: 1234567890
   - **Nombre**: Juan
   - **Apellido**: Pérez
   - **Email**: juan@ejemplo.com
   - **Semestre**: 3
   - **Promedio de notas**: 85
   - **Porcentaje de asistencia**: 92
4. Haz clic en **"Guardar"**

### Paso 3: Generar Predicción

1. Ve a **Predicciones**
2. Haz clic en **"Agregar nueva predicción"**
3. Selecciona: **Juan Pérez**
4. Haz clic en **"Generar predicción"**
5. ¡Verás el resultado! (Debe ser "Bajo" porque tiene notas y asistencia altas)

### Paso 4: Ver Dashboard

1. Ve a **Panel**
2. Verás:
   - Total de estudiantes
   - Total de predicciones
   - Distribución de riesgos

---

## 🗂️ Estructura de Carpetas Explicada

```
sistema-prediccion-rendimiento/
├── backend/
│   ├── src/
│   │   ├── entities/              👈 Modelos de datos (Student, Prediction, etc)
│   │   ├── modules/               👈 Lógica de negocio
│   │   │   ├── estudiantes/
│   │   │   └── predicciones/
│   │   ├── database/
│   │   │   └── init.sql          👈 Script para crear tablas
│   │   └── auth/                 👈 Login/autenticación
│   ├── database/
│   │   └── academic_prediction.db 👈 ARCHIVO SQLITE (tu base de datos real)
│   └── package.json              👈 Dependencias Node.js
│
├── frontend/
│   ├── src/
│   │   ├── components/            👈 Componentes React (Navbar, Dashboard, etc)
│   │   ├── services/              👈 Conexión con la API
│   │   ├── i18n/                 👈 Traducciones (ES/EN)
│   │   └── contexts/             👈 Estado global (LanguageContext, AuthContext)
│   └── package.json              👈 Dependencias Node.js
│
└── README.md                       👈 Documentación
```

---

## 📦 Dependencias Principales

### Backend (Node.js)

| Paquete       | Para Qué              |
| ------------- | --------------------- |
| `@nestjs/*`   | Framework backend     |
| `typeorm`     | Conectar con BD       |
| `sqlite3`     | **Driver SQLite** ⭐  |
| `@nestjs/jwt` | Autenticación         |
| `bcrypt`      | Encriptar contraseñas |

### Frontend (Node.js)

| Paquete            | Para Qué                   |
| ------------------ | -------------------------- |
| `react`            | **Librería UI** ⭐         |
| `react-router-dom` | Navegación entre páginas   |
| `axios`            | Hablar con el backend      |
| `tailwindcss`      | **Estilos CSS** ⭐         |
| `typescript`       | Código tipado (más seguro) |

### Base de Datos

- **SQLite** ⭐ - Base de datos local (archivo `.db`)
- **TypeORM** - Conectar desde Node.js

---

## ❌ Problemas Comunes

### "npm: comando no encontrado"

**Solución:** Node.js no está instalado

- Descarga e instala desde https://nodejs.org/
- Reinicia tu computadora

### "El puerto 3000 ya está en uso"

**Solución:** Otra aplicación está usando el puerto

```powershell
# Encuentra qué proceso lo usa
netstat -ano | findstr :3000

# Ciérralo (reemplaza XXXX con el PID mostrado)
taskkill /PID XXXX /F
```

### "No puedo ejecutar instalar.ps1"

**Solución:** Permisos de PowerShell

```powershell
# Como ADMINISTRADOR, ejecuta:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego intenta nuevamente:
.\instalar.ps1
```

### "La BD no se crea"

**Solución:** Crea la carpeta manualmente

```powershell
cd backend
New-Item -ItemType Directory -Force -Path "database"
npm run start:dev
```

### "Error de conexión a http://localhost:3001"

**Solución:** El backend no está corriendo

- Verifica que el backend esté iniciado en otra ventana
- Verás: "Backend ejecutándose en http://localhost:3001"

---

## 📚 Pasos Siguientes

Una vez que todo funcione:

1. **Lee la documentación:**

   - Abre `README.md` para detalles técnicos
   - Abre `docs/INICIO_RAPIDO.md` para guía de uso

2. **Crea más estudiantes y predicciones**

   - Prueba con diferentes combinaciones de promedio y asistencia
   - Observa cómo cambia el nivel de riesgo

3. **Experimenta con las características:**

   - Cambia el idioma a Inglés
   - Activa el modo oscuro
   - Prueba en móvil (abre DevTools: F12)

4. **Haz un backup de tus datos:**
   - La BD está en: `backend/database/academic_prediction.db`
   - Cópiala a una carpeta de respaldo

---

## 🆘 Necesitas Ayuda?

1. **Lee el README.md** - Tiene más detalles
2. **Consulta `docs/GUIA_PRUEBAS.md`** - Casos de prueba
3. **Revisa la consola** - Busca mensajes de error
4. **Reinicia todo:**
   ```powershell
   # Cierra todas las ventanas de PowerShell
   # Abre una nueva y ejecuta:
   .\instalar.ps1
   ```

---

**¡Felicidades! 🎉 Ya tienes el sistema instalado y funcionando.**

Ahora puedes empezar a crear predicciones para tus estudiantes.

---

_Última actualización: 22 de Octubre de 2025_
