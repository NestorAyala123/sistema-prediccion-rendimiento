# 🚀 Guía de Inicio Rápido

## 📋 Requisitos Previos

- **Node.js 16+** (descargar de [nodejs.org](https://nodejs.org/))
- **npm 8+** (se instala con Node.js)
- **Git** (para clonar el repositorio)

Verifica la instalación:

```powershell
node --version
npm --version
```

---

## 🎯 Opción 1: Arranque Automático (RECOMENDADO)

### Paso 1: Abre PowerShell en la carpeta del proyecto

```powershell
# Navega a la carpeta del proyecto
cd "C:\Users\HP\OneDrive - ULEAM\Escritorio\predipcion\sistema-prediccion-rendimiento"
```

### Paso 2: Ejecuta el script de instalación

```powershell
.\instalar.ps1
```

### Paso 3: Selecciona la opción 4 (Arrancar ambos en paralelo)

```
Selecciona una opción:
  1 - Instalar dependencias (backend + frontend)
  2 - Arrancar backend (puerto 3001)
  3 - Arrancar frontend (puerto 3000)
  4 - Arrancar ambos en paralelo ⚡ RECOMENDADO
  5 - Limpiar y reinstalar todo
  6 - Verificar estado del sistema
  7 - Salir

Ingresa el número: 4
```

### ✅ Ambos servicios se abrirán automáticamente

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

## 🔧 Opción 2: Arranque Manual

### Terminal 1 - Backend

```powershell
cd backend
npm install        # Solo en la primera ejecución
npm run start:dev
```

Esperado:

```
[Nest] 12345 - 10/21/2025, 10:30:15 AM LOG [NestFactory]
Nest application successfully started on port 3001
```

### Terminal 2 - Frontend

```powershell
cd frontend
npm install        # Solo en la primera ejecución
npm start
```

Esperado:

```
Compiled successfully!

You can now view sistema-prediccion-rendimiento in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 📱 Acceso a la Aplicación

Una vez ambos servicios estén corriendo:

1. Abre el navegador
2. Ve a **http://localhost:3000**
3. Verás la pantalla de Login

### Credenciales de Demo

Puedes entrar sin backend:

- **Email**: cualquiera
- **Password**: cualquiera

La aplicación funcionará en **modo demo** con datos simulados hasta que implementes el backend.

---

## 🐛 Solución de Problemas

### El puerto 3000 o 3001 está en uso

```powershell
# Opción 1: Termina los procesos anteriores (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Opción 2: Usa el script para limpiar todo
.\instalar.ps1
# Selecciona opción 5 (Limpiar y reinstalar)
```

### Errores de dependencias

```powershell
# Reinstala todo desde cero
.\instalar.ps1
# Selecciona opción 5 (Limpiar y reinstalar)
```

### El frontend no compila

```powershell
# Verifica que estés en la carpeta correcta
cd frontend
npm install
npm start
```

### El backend no inicia

```powershell
# Verifica que estés en la carpeta correcta
cd backend
npm install
npm run start:dev
```

---

## ⚙️ Estructura del Proyecto

```
sistema-prediccion-rendimiento/
├── backend/                 # API NestJS (puerto 3001)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React App (puerto 3000)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── instalar.ps1            # Script de instalación
└── README.md
```

---

## 📚 Rutas de la Aplicación

| Ruta            | Descripción            | Requiere Auth |
| --------------- | ---------------------- | ------------- |
| `/login`        | Login de usuario       | ❌ No         |
| `/register`     | Registro de usuario    | ❌ No         |
| `/`             | Dashboard principal    | ✅ Sí         |
| `/estudiantes`  | Gestión de estudiantes | ✅ Sí         |
| `/predicciones` | Predicciones de riesgo | ✅ Sí         |

---

## 🔑 Variables de Entorno

### Frontend (`frontend/.env`)

```
REACT_APP_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)

```
PORT=3001
DATABASE_URL=sqlite:./database.db
JWT_SECRET=tu-clave-secreta-aqui
NODE_ENV=development
```

---

## 📊 Monitoreo

Para ver el estado del sistema en cualquier momento:

```powershell
.\instalar.ps1
# Selecciona opción 6 (Verificar estado del sistema)
```

Verás información sobre:

- Versión de Node.js y npm
- Estado de las dependencias instaladas
- Disponibilidad de los puertos

---

## 🚦 Control de Procesos

### Detener backend o frontend

- En la terminal correspondiente, presiona **Ctrl+C**
- Esto detendrá el servicio sin cerrar la ventana

### Detener todo

```powershell
# En cada terminal de backend/frontend
Ctrl+C

# Luego cierra las ventanas normalmente
```

---

## 💡 Consejos Útiles

1. **Mantén dos terminales abiertas**: Una para backend, otra para frontend
2. **Revisa la consola**: Ahí aparecerán los errores y logs
3. **Borra el cache del navegador**: Si algo no funciona, presiona **F5** o **Ctrl+F5**
4. **Usa DevTools**: Presiona **F12** para ver errores de la aplicación

---

## 📞 Soporte

Si necesitas ayuda:

1. Revisa los errores en la consola (F12 en el navegador)
2. Ejecuta la opción 6 del script para verificar el estado
3. Consulta el archivo `BACKEND_AUTH_SETUP.md` para detalles del backend

---

**¡Listo! 🎉 Tu aplicación debe estar corriendo.**

¿Necesitas ayuda con algo específico?
