# 🎓 Sistema de Predicción de Rendimiento Académico con IA

Sistema web completo para predecir el rendimiento académico de estudiantes utilizando Inteligencia Artificial.

## 🚀 Inicio Rápido

### **Iniciar el Sistema Completo**
```powershell
.\iniciar-sistema-completo.ps1
```

Este comando inicia automáticamente:
- 🤖 **Microservicio de IA** (FastAPI) → http://localhost:8000
- 🔧 **Backend** (NestJS) → http://localhost:4000
- ⚛️ **Frontend** (React) → http://localhost:3000

### **Detener el Sistema**
```powershell
.\detener-sistema.ps1
```

---

## 📋 Requisitos Previos

Antes de ejecutar el sistema, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **Python** (v3.8 o superior) - [Descargar](https://www.python.org/)
- **npm** (incluido con Node.js)

---

## 🛠️ Instalación (Solo Primera Vez)

### 1. Instalar dependencias del Backend
```powershell
cd backend
npm install
cd ..
```

### 2. Instalar dependencias del Frontend
```powershell
cd frontend
npm install
cd ..
```

### 3. Crear entorno virtual de Python e instalar dependencias
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic
deactivate
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│              React + TypeScript                     │
│            http://localhost:3000                    │
└──────────────────┬──────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                              │
    ▼                              ▼
┌─────────────────┐    ┌──────────────────────┐
│    BACKEND      │    │  MICROSERVICIO IA    │
│  NestJS + SQLite│    │  FastAPI + Python    │
│  localhost:4000 │    │  localhost:8000      │
└─────────────────┘    └──────────────────────┘
```

### **Componentes**

#### 🔧 **Backend (NestJS)**
- API REST para gestión de estudiantes
- Base de datos SQLite
- Autenticación JWT
- CRUD completo

#### 🤖 **Microservicio de IA (FastAPI)**
- Modelo de predicción de riesgo académico
- Análisis de factores críticos
- Recomendaciones personalizadas
- Documentación automática en `/docs`

#### ⚛️ **Frontend (React)**
- Interfaz intuitiva y responsiva
- Dashboard interactivo
- Integración con servicios backend e IA
- Soporte de accesibilidad

---

## 📖 Uso del Sistema

### **1. Acceder a la Aplicación**
Abre tu navegador en: http://localhost:3000

### **2. Registrarse/Iniciar Sesión**
- Crea una cuenta de consejero académico
- Inicia sesión con tus credenciales

### **3. Gestionar Estudiantes**
- Agregar nuevos estudiantes
- Ver lista de estudiantes
- Editar información

### **4. Generar Predicciones con IA**
1. Ve a la sección **"Predicciones"**
2. Haz clic en **"Generar Nuevas"**
3. Selecciona un estudiante
4. Completa los datos académicos:
   - Notas promedio
   - Asistencia
   - Horas de estudio
   - Participación en clase
   - Entregas de tareas
   - Notas de exámenes
5. El sistema generará automáticamente:
   - ⚠️ Nivel de riesgo (Bajo/Medio/Alto)
   - 📊 Probabilidad y puntuación
   - 🔍 Factores críticos
   - 💡 Recomendaciones personalizadas

---

## 🔗 URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz de usuario |
| **Backend** | http://localhost:4000 | API REST |
| **IA API** | http://localhost:8000 | Microservicio de predicción |
| **IA Docs** | http://localhost:8000/docs | Documentación interactiva |
| **Health Check Backend** | http://localhost:4000/health | Estado del backend |
| **Health Check IA** | http://localhost:8000/health | Estado del microservicio IA |

---

## 🗂️ Estructura del Proyecto

```
sistema-prediccion-rendimiento/
├── backend/                    # Backend NestJS
│   ├── src/
│   │   ├── auth/              # Autenticación
│   │   ├── entities/          # Entidades de BD
│   │   ├── modules/           # Módulos de negocio
│   │   └── database/          # Configuración BD
│   └── package.json
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Servicios API
│   │   ├── contexts/          # Contextos React
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
├── predictor_api.py           # Microservicio de IA
├── iniciar-sistema-completo.ps1  # Script de inicio
└── detener-sistema.ps1        # Script para detener
```

---

## 🤝 Tecnologías Utilizadas

### **Backend**
- NestJS
- TypeORM
- SQLite
- JWT Authentication
- Passport.js

### **Frontend**
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router

### **Microservicio IA**
- FastAPI
- Pydantic
- Uvicorn
- Python 3.10+

---

## 🐛 Solución de Problemas

### **Error: Puerto ya en uso**
```powershell
# Detén todos los servicios primero
.\detener-sistema.ps1

# Luego vuelve a iniciar
.\iniciar-sistema-completo.ps1
```

### **Error: No se puede ejecutar scripts de PowerShell**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### **Error: Módulos de Node no encontrados**
```powershell
cd backend
npm install
cd ../frontend
npm install
```

### **Error: Microservicio de IA no responde**
Verifica que el entorno virtual de Python esté creado:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic
```

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📧 Contacto

Para preguntas o soporte, abre un issue en el repositorio.

---

**✨ Desarrollado con ❤️ para mejorar la educación mediante Inteligencia Artificial**
