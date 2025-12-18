"""
Microservicio de Predicción de Rendimiento Académico con IA
FastAPI + Uvicorn + CORS habilitado
Puerto: 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, Optional
import uvicorn
from datetime import datetime
import random

# Inicializar FastAPI
app = FastAPI(
    title="Predictor de Rendimiento Académico",
    description="Microservicio de predicción basado en IA para análisis de riesgo estudiantil",
    version="1.0.0"
)

# Configuración de CORS (permitir localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# MODELOS DE DATOS
# =====================

class EstudianteInput(BaseModel):
    """Estructura de entrada del estudiante para predicción"""
    id_estudiante: str = Field(..., description="Identificador único del estudiante")
    nombres: str = Field(..., description="Nombres del estudiante")
    apellidos: str = Field(..., description="Apellidos del estudiante")
    semestre_actual: Optional[int] = Field(1, ge=1, le=10, description="Semestre actual (1-10)")
    
    # Métricas académicas
    notas_promedio: float = Field(..., ge=0, le=10, description="Promedio de calificaciones (0-10)")
    notas_examenes_promedio: float = Field(..., ge=0, le=10, description="Promedio de exámenes (0-10)")
    entregas_tareas_porcentaje: float = Field(..., ge=0, le=100, description="Porcentaje de tareas entregadas")
    
    # Métricas de asistencia
    asistencia_porcentaje: float = Field(..., ge=0, le=100, description="Porcentaje de asistencia")
    
    # Hábitos de estudio
    horas_estudio_semana: float = Field(..., ge=0, le=168, description="Horas de estudio por semana")
    participacion_clase: Literal["baja", "media", "alta"] = Field("media", description="Nivel de participación")
    usa_tecnicas_estudio: Optional[bool] = Field(False, description="Usa técnicas de estudio efectivas")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "id_estudiante": "1234567890",
                "nombres": "Juan",
                "apellidos": "Pérez",
                "semestre_actual": 3,
                "notas_promedio": 6.5,
                "notas_examenes_promedio": 6.0,
                "entregas_tareas_porcentaje": 75.0,
                "asistencia_porcentaje": 80.0,
                "horas_estudio_semana": 10.0,
                "participacion_clase": "media",
                "usa_tecnicas_estudio": True
            }
        }
    }


class PrediccionOutput(BaseModel):
    """Estructura de salida de la predicción"""
    riesgo: Literal["bajo", "medio", "alto"] = Field(..., description="Nivel de riesgo académico")
    probabilidad: float = Field(..., ge=0, le=1, description="Probabilidad de riesgo (0-1)")
    puntuacion: float = Field(..., ge=0, le=100, description="Puntuación del estudiante (0-100)")
    factores_criticos: list[str] = Field(..., description="Factores que impactan el rendimiento")
    recomendaciones: list[str] = Field(..., description="Recomendaciones personalizadas")
    fecha_prediccion: str = Field(..., description="Timestamp de la predicción")
    modelo_version: str = Field("1.0.0", description="Versión del modelo de IA")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "riesgo": "alto",
                "probabilidad": 0.85,
                "puntuacion": 45.5,
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
        }
    }


# =====================
# LÓGICA DE PREDICCIÓN
# =====================

def calcular_prediccion(estudiante: EstudianteInput) -> PrediccionOutput:
    """
    Simula el modelo de IA para predecir riesgo académico.
    En producción, aquí irían modelos de ML como scikit-learn, TensorFlow, etc.
    """
    
    # Calcular puntuación ponderada (0-100)
    puntuacion = (
        estudiante.notas_promedio * 4 +                      # 40% peso en notas
        estudiante.asistencia_porcentaje * 0.25 +            # 25% peso en asistencia
        estudiante.entregas_tareas_porcentaje * 0.15 +       # 15% peso en tareas
        estudiante.horas_estudio_semana * 1.5 +              # 15% peso en estudio
        (10 if estudiante.participacion_clase == "alta" else 
         5 if estudiante.participacion_clase == "media" else 0)  # 5% peso en participación
    )
    
    # Normalizar puntuación (0-100)
    puntuacion = min(100, max(0, puntuacion))
    
    # Determinar nivel de riesgo
    if puntuacion >= 70:
        riesgo = "bajo"
        probabilidad = round(1 - (puntuacion / 100), 2)
    elif puntuacion >= 50:
        riesgo = "medio"
        probabilidad = round(0.5 + (70 - puntuacion) / 40, 2)
    else:
        riesgo = "alto"
        probabilidad = round(0.7 + (50 - puntuacion) / 100, 2)
    
    # Identificar factores críticos
    factores_criticos = []
    
    if estudiante.notas_promedio < 6:
        factores_criticos.append(f"Promedio de notas crítico ({estudiante.notas_promedio:.1f}/10)")
    elif estudiante.notas_promedio < 7:
        factores_criticos.append(f"Promedio de notas bajo ({estudiante.notas_promedio:.1f}/10)")
    
    if estudiante.asistencia_porcentaje < 70:
        factores_criticos.append(f"Asistencia muy baja ({estudiante.asistencia_porcentaje:.0f}%)")
    elif estudiante.asistencia_porcentaje < 80:
        factores_criticos.append(f"Asistencia irregular ({estudiante.asistencia_porcentaje:.0f}%)")
    
    if estudiante.horas_estudio_semana < 5:
        factores_criticos.append(f"Pocas horas de estudio semanales ({estudiante.horas_estudio_semana:.0f}h)")
    
    if estudiante.entregas_tareas_porcentaje < 70:
        factores_criticos.append(f"Bajo cumplimiento de tareas ({estudiante.entregas_tareas_porcentaje:.0f}%)")
    
    if estudiante.participacion_clase == "baja":
        factores_criticos.append("Participación en clase insuficiente")
    
    if not estudiante.usa_tecnicas_estudio:
        factores_criticos.append("No utiliza técnicas de estudio efectivas")
    
    # Generar recomendaciones personalizadas
    recomendaciones = []
    
    if estudiante.notas_promedio < 7:
        recomendaciones.append("📚 Reforzar conocimientos con tutorías personalizadas")
        recomendaciones.append("📝 Realizar ejercicios adicionales en materias débiles")
    
    if estudiante.horas_estudio_semana < 10:
        recomendaciones.append(f"⏰ Incrementar horas de estudio a 15h semanales (actualmente {estudiante.horas_estudio_semana:.0f}h)")
    
    if estudiante.asistencia_porcentaje < 85:
        recomendaciones.append("✅ Mejorar asistencia a clases (objetivo: 90%)")
    
    if estudiante.participacion_clase != "alta":
        recomendaciones.append("🙋 Participar más activamente en clases y discusiones")
    
    if not estudiante.usa_tecnicas_estudio:
        recomendaciones.append("🧠 Implementar técnicas de estudio: Pomodoro, mapas mentales, flashcards")
    
    if estudiante.entregas_tareas_porcentaje < 90:
        recomendaciones.append("📅 Organizar calendario de entregas y cumplir deadlines")
    
    # Si no hay factores críticos, agregar mensaje positivo
    if not factores_criticos:
        factores_criticos.append("✅ Desempeño académico satisfactorio en todas las áreas")
    
    if not recomendaciones:
        recomendaciones.append("🎉 Mantener el excelente trabajo actual")
        recomendaciones.append("🚀 Considerar actividades de profundización académica")
    
    return PrediccionOutput(
        riesgo=riesgo,
        probabilidad=probabilidad,
        puntuacion=round(puntuacion, 2),
        factores_criticos=factores_criticos,
        recomendaciones=recomendaciones,
        fecha_prediccion=datetime.now().isoformat(),
        modelo_version="1.0.0"
    )


# =====================
# ENDPOINTS DE LA API
# =====================

@app.get("/")
async def root():
    """Endpoint raíz para verificar que el servicio está activo"""
    return {
        "service": "Predictor de Rendimiento Académico",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Endpoint de health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/predict", response_model=PrediccionOutput)
async def predecir_rendimiento(estudiante: EstudianteInput):
    """
    Endpoint principal de predicción de riesgo académico
    
    Recibe los datos del estudiante y retorna:
    - Nivel de riesgo (bajo/medio/alto)
    - Probabilidad numérica
    - Factores críticos identificados
    - Recomendaciones personalizadas
    """
    try:
        prediccion = calcular_prediccion(estudiante)
        return prediccion
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en el procesamiento de la predicción: {str(e)}"
        )


@app.post("/predict/batch")
async def predecir_batch(estudiantes: list[EstudianteInput]):
    """
    Endpoint para predicción en lote (múltiples estudiantes)
    """
    try:
        predicciones = [calcular_prediccion(est) for est in estudiantes]
        return {
            "total": len(predicciones),
            "predicciones": predicciones
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en el procesamiento batch: {str(e)}"
        )


# =====================
# EJECUTAR SERVIDOR
# =====================

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Iniciando Microservicio de Predicción de IA")
    print("=" * 60)
    print("📍 URL: http://localhost:8000")
    print("📖 Documentación interactiva: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/health")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
