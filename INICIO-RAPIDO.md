# ⚡ GUÍA RÁPIDA - Sistema de Predicción de Rendimiento Académico

## 🚀 INICIO RÁPIDO

### Para iniciar TODO el sistema:
```powershell
.\iniciar-sistema-completo.ps1
```

### Para detener TODO el sistema:
```powershell
.\detener-sistema.ps1
```

---

## 📍 URLs del Sistema

Una vez iniciado, abre estas URLs en tu navegador:

| Servicio | URL |
|----------|-----|
| 🌐 **Frontend** (Interfaz Principal) | http://localhost:3000 |
| 🔧 **Backend API** | http://localhost:4000 |
| 🤖 **IA - Predicciones** | http://localhost:8000 |
| 📖 **IA - Documentación** | http://localhost:8000/docs |

---

## 🛠️ Primera vez? Instala las dependencias

### Backend:
```powershell
cd backend
npm install
cd ..
```

### Frontend:
```powershell
cd frontend
npm install
cd ..
```

### Python IA:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic
```

---

## ✨ Características Principales

### 1️⃣ Gestión de Estudiantes
- Agregar, editar y eliminar estudiantes
- Ver lista completa con búsqueda

### 2️⃣ Predicción con IA
- Análisis de riesgo académico automático
- Factores críticos identificados
- Recomendaciones personalizadas

### 3️⃣ Dashboard Interactivo
- Estadísticas en tiempo real
- Gráficos y visualizaciones

---

## 🐛 Problemas Comunes

### ❌ "Puerto ya en uso"
```powershell
.\detener-sistema.ps1
.\iniciar-sistema-completo.ps1
```

### ❌ "No se puede ejecutar scripts"
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### ❌ "Módulos no encontrados"
Instala las dependencias (ver sección "Primera vez")

---

## 📚 Documentación Completa

Lee el archivo [README.md](README.md) para más detalles.

---

**✨ Sistema listo en 30 segundos con un solo comando!**
