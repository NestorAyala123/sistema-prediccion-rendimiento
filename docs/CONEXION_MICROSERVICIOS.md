# Integración y Conexión de Microservicios

## Arquitectura del Sistema

El sistema de predicción de rendimiento académico está compuesto por tres microservicios independientes:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  FRONTEND       │────▶│  BACKEND        │────▶│  PREDICTOR IA   │
│  React          │     │  NestJS         │     │  FastAPI        │
│  Puerto: 3000   │     │  Puerto: 4000   │     │  Puerto: 8000   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                        ┌──────────┐            ┌──────────┐
                        │ SQLite/  │            │ Modelo   │
                        │ MongoDB  │            │    IA    │
                        └──────────┘            └──────────┘
```

## Flujo de Comunicación

### 1. Frontend → Backend
- **Protocolo**: HTTP/REST
- **Puerto**: 4000
- **URL Base**: `http://localhost:4000`
- **Autenticación**: JWT Bearer Token

#### Ejemplo de llamada:
```typescript
const response = await api.post('/predicciones', {
  id_estudiante: '12345',
  notas_promedio: 7.5,
  asistencia_porcentaje: 85
});
```

### 2. Backend → Microservicio IA
- **Protocolo**: HTTP/REST
- **Puerto**: 8000
- **URL Base**: `http://localhost:8000` (desarrollo) o `http://predictor:8000` (Docker)
- **Autenticación**: No requiere

#### Configuración en Backend:
```typescript
// predicciones.service.ts
private readonly predictorUrl: string;

constructor() {
  this.predictorUrl = process.env.PREDICTOR_API_URL || 'http://localhost:8000';
}
```

#### Ejemplo de llamada:
```typescript
const response = await axios.post(`${this.predictorUrl}/predict`, {
  id_estudiante: estudiante.id_estudiante,
  nombres: estudiante.nombres,
  apellidos: estudiante.apellidos,
  notas_promedio: data.notas_promedio,
  asistencia_porcentaje: data.asistencia_porcentaje,
  // ... más campos
});
```

### 3. Microservicio IA → Backend (Respuesta)
El microservicio de IA retorna:
```json
{
  "riesgo": "medio",
  "probabilidad": 0.65,
  "puntuacion": 72.5,
  "factores_criticos": [
    "Promedio de notas bajo (6.5/10)",
    "Asistencia irregular (80%)"
  ],
  "recomendaciones": [
    "Incrementar horas de estudio semanales",
    "Participar más activamente en clase"
  ],
  "fecha_prediccion": "2025-01-21T15:30:00",
  "modelo_version": "1.0.0"
}
```

## Configuración de Variables de Entorno

### Backend (.env)
```bash
# URL del microservicio de predicción
PREDICTOR_API_URL=http://localhost:8000

# Para Docker Compose
# PREDICTOR_API_URL=http://predictor:8000
```

### Frontend (.env)
```bash
# URL del backend
REACT_APP_API_URL=http://localhost:4000

# URL del microservicio IA (opcional, directo desde frontend)
REACT_APP_AI_API_URL=http://localhost:8000
```

## Ejecutar el Sistema

### Opción 1: Desarrollo Local

#### 1. Iniciar todos los servicios:
```powershell
.\iniciar-sistema-completo.ps1
```

Este script inicia en orden:
1. Microservicio IA (Python/FastAPI) - Puerto 8000
2. Backend (NestJS) - Puerto 4000
3. Frontend (React) - Puerto 3000

#### 2. Iniciar servicios manualmente:

**Microservicio IA:**
```powershell
python predictor_api.py
```

**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
```powershell
cd frontend
npm start
```

### Opción 2: Docker Compose

```powershell
docker-compose up -d
```

El `docker-compose.yml` está configurado con:
- Dependencias entre servicios
- Variables de entorno apropiadas
- Health checks para el microservicio IA

## Manejo de Errores y Fallback

El backend incluye lógica de respaldo si el microservicio de IA no está disponible:

```typescript
try {
  // Intentar llamar al microservicio de IA
  const response = await axios.post(`${this.predictorUrl}/predict`, ...);
  return response.data;
} catch (error) {
  console.error('Error al llamar al microservicio de predicción:', error.message);
  
  // Usar lógica de fallback local
  return {
    nivel_riesgo: this.calcularNivelRiesgo(data),
    factores_clave: this.generarFactoresClave(data),
    advertencia: 'Predicción generada con lógica de respaldo'
  };
}
```

## Verificar Estado de los Servicios

### Health Checks:

**Frontend:**
```
http://localhost:3000
```

**Backend:**
```
http://localhost:4000
```

**Microservicio IA:**
```
http://localhost:8000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-21T15:30:00"
}
```

**Documentación Interactiva de IA:**
```
http://localhost:8000/docs
```

## Resolución de Problemas

### Error: "Cannot connect to predictor service"

**Causa**: El microservicio de IA no está en ejecución o no es accesible.

**Solución**:
1. Verificar que el servicio está corriendo:
   ```powershell
   curl http://localhost:8000/health
   ```

2. Revisar logs del microservicio:
   - Buscar mensajes de error en la ventana de PowerShell donde se ejecutó

3. Verificar que el puerto 8000 no esté ocupado:
   ```powershell
   Get-NetTCPConnection -LocalPort 8000
   ```

### Error: "CORS policy" desde el frontend

**Causa**: Configuración de CORS en el microservicio de IA.

**Solución**: Verificar en `predictor_api.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error: "Request timeout" al llamar a IA

**Causa**: El microservicio está sobrecargado o muy lento.

**Solución**: Ajustar el timeout en el backend:
```typescript
const response = await axios.post(`${this.predictorUrl}/predict`, 
  estudianteInput, 
  {
    timeout: 10000, // 10 segundos
  }
);
```

## Dependencias Necesarias

### Backend (Node.js):
```json
{
  "axios": "^1.6.5"
}
```

### Microservicio IA (Python):
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
```

## Seguridad

### Consideraciones:
1. **Autenticación**: El microservicio de IA NO requiere autenticación actualmente (comunicación interna).
2. **Red interna**: En producción, el microservicio de IA debe estar en una red privada.
3. **Rate limiting**: Considerar implementar límites de tasa en el microservicio de IA.
4. **Validación de entrada**: Todos los datos se validan con Pydantic en el microservicio.

### Recomendaciones para Producción:
```python
# Agregar rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/predict")
@limiter.limit("10/minute")
async def predecir_rendimiento(request: Request, estudiante: EstudianteInput):
    ...
```

## Monitoreo

### Logs recomendados:

**Backend:**
```typescript
console.log(`Llamando al microservicio de IA: ${this.predictorUrl}/predict`);
console.log(`Respuesta de IA recibida para estudiante ${id_estudiante}`);
```

**Microservicio IA:**
```python
import logging
logging.info(f"Predicción solicitada para estudiante: {estudiante.id_estudiante}")
logging.info(f"Resultado: riesgo={riesgo}, puntuación={puntuacion}")
```

## Pruebas de Integración

### Test de conexión completa:

```bash
# 1. Health check del microservicio
curl http://localhost:8000/health

# 2. Predicción directa
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "id_estudiante": "12345",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "notas_promedio": 7.5,
    "asistencia_porcentaje": 85,
    "horas_estudio_semana": 10,
    "participacion_clase": "media"
  }'

# 3. A través del backend
curl -X POST http://localhost:4000/predicciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "id_estudiante": "12345",
    "notas_promedio": 7.5,
    "asistencia_porcentaje": 85
  }'
```

---

**Última actualización**: Diciembre 2025  
**Versión del sistema**: 1.0.0
