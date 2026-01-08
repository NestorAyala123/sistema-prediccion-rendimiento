# 🎓 Sistema de Predicción de Rendimiento Académico con IA

Sistema web completo para predecir el rendimiento académico de estudiantes utilizando Inteligencia Artificial y **MongoDB**.

## 🚀 Inicio Rápido

### **Prerequisitos**
1. **MongoDB** instalado y corriendo
2. **Node.js** (v16+)
3. **Python** (v3.8+)

### **Iniciar MongoDB**
```powershell
# Windows
net start MongoDB
# O manualmente
mongod --dbpath=C:\data\db
```

### **Iniciar el Sistema Completo**
```powershell
.\iniciar-sistema-completo.ps1
```

Este comando inicia automáticamente:
- 🗄️ **MongoDB** (Base de datos) → puerto 27017
- 🤖 **Microservicio de IA** (FastAPI) → http://localhost:8000
- 🔧 **Backend** (NestJS + MongoDB) → http://localhost:4000
- ⚛️ **Frontend** (React) → http://localhost:3000

### **Detener el Sistema**
```powershell
.\detener-sistema.ps1
```

---

## 📋 Requisitos Previos

Antes de ejecutar el sistema, asegúrate de tener instalado:

- **MongoDB** (v6.0 o superior) - [Descargar](https://www.mongodb.com/try/download/community)
- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **Python** (v3.8 o superior) - [Descargar](https://www.python.org/)
- **npm** (incluido con Node.js)

---

## 🛠️ Instalación (Solo Primera Vez)

### 1. Instalar MongoDB
```powershell
# Windows: Descargar desde https://www.mongodb.com/try/download/community
# Instalar como servicio de Windows
```

### 2. Instalar dependencias del Backend
```powershell
cd backend
npm install
cd ..
```

### 3. Poblar la Base de Datos
```powershell
cd backend
npm run seed
cd ..
```

### 4. Instalar dependencias del Frontend
```powershell
cd frontend
npm install
cd ..
```

### 5. Crear entorno virtual de Python e instalar dependencias
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
│ NestJS + MongoDB│    │  FastAPI + Python    │
│  localhost:4000 │    │  localhost:8000      │
└────────┬────────┘    └──────────────────────┘
         │
         ▼
┌─────────────────┐
│    MONGODB      │
│  NoSQL Database │
│  localhost:27017│
└─────────────────┘
```

### **Componentes**

#### 🗄️ **MongoDB**
- Base de datos NoSQL principal
- 9 colecciones (usuarios, estudiantes, calificaciones, etc.)
- Schemas con Mongoose
- Datos persistentes

#### 🔧 **Backend (NestJS)**
- API REST para gestión académica
- Mongoose ODM
- Autenticación JWT
- CRUD completo
- Sistema de auditoría

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

### **2. Iniciar Sesión**

#### **👥 Usuarios Administrativos (Admin/Docentes):**
- **Admin**: admin@universidad.edu / Admin2025!
- **Docente 1**: carlos.rodriguez@universidad.edu / Carlos@2024
- **Docente 2**: maria.gonzalez@universidad.edu / Maria#Docente

#### **👨‍🎓 Estudiantes de Prueba:**
- **Juan Pérez**: juan.perez@universidad.edu / password123
- **Ana García**: ana.garcia@universidad.edu / password123
- **Luis Martínez**: luis.martinez@universidad.edu / password123

**Nota**: Los estudiantes acceden con sus credenciales a su interfaz correspondiente y pueden ver sus calificaciones, asistencias y predicciones personalizadas.

### **3. Gestionar Estudiantes**
- Ver lista de estudiantes (ya hay 3 de ejemplo)
- Agregar nuevos estudiantes
- Editar información
- Ver historial académico completo

### **4. Registrar Calificaciones**
1. Selecciona un estudiante
2. Elige la asignatura y periodo
3. Registra notas por tipo de evaluación
4. El sistema calcula promedios automáticamente

### **5. Control de Asistencia**
1. Selecciona asignatura y fecha
2. Marca asistencia de estudiantes
3. Ver estadísticas de asistencia
4. Alertas automáticas (< 75%)

### **6. Generar Predicciones con IA**
1. Ve a la sección **"Predicciones"**
2. Haz clic en **"Generar Nuevas"**
3. Selecciona un estudiante
4. El sistema analiza automáticamente:
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
