/**
 * Servicio de Integración con Microservicio de IA
 * Comunicación con predictor_api.py (FastAPI)
 */

import axios, { AxiosError } from 'axios';

// =====================
// CONFIGURACIÓN
// =====================

const AI_API_URL = process.env.REACT_APP_AI_API_URL || 'http://localhost:8000';

const aiApiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos de timeout
});

// =====================
// INTERFACES TYPESCRIPT
// =====================

/**
 * Input para el modelo de IA - coincide con EstudianteInput de Python
 */
export interface EstudianteAIInput {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  semestre_actual?: number;
  
  // Métricas académicas
  notas_promedio: number;
  notas_examenes_promedio: number;
  entregas_tareas_porcentaje: number;
  
  // Asistencia
  asistencia_porcentaje: number;
  
  // Hábitos de estudio
  horas_estudio_semana: number;
  participacion_clase: 'baja' | 'media' | 'alta';
  usa_tecnicas_estudio?: boolean;
}

/**
 * Output del modelo de IA - coincide con PrediccionOutput de Python
 */
export interface PrediccionAIOutput {
  riesgo: 'bajo' | 'medio' | 'alto';
  probabilidad: number; // 0-1
  puntuacion: number; // 0-100
  factores_criticos: string[];
  recomendaciones: string[];
  fecha_prediccion: string;
  modelo_version: string;
}

/**
 * Respuesta de predicción en lote
 */
export interface PrediccionBatchResponse {
  total: number;
  predicciones: PrediccionAIOutput[];
}

/**
 * Error personalizado de la API de IA
 */
export interface AIApiError {
  detail: string;
  status: number;
}

// =====================
// FUNCIONES PRINCIPALES
// =====================

/**
 * Predecir riesgo académico para un estudiante
 * 
 * @param estudiante - Datos del estudiante para análisis
 * @returns Predicción con nivel de riesgo y recomendaciones
 * @throws Error si la API falla o el servicio no está disponible
 */
export async function predecirRendimiento(
  estudiante: EstudianteAIInput
): Promise<PrediccionAIOutput> {
  try {
    const response = await aiApiClient.post<PrediccionAIOutput>('/predict', estudiante);
    return response.data;
  } catch (error) {
    throw handleAIApiError(error);
  }
}

/**
 * Predecir riesgo para múltiples estudiantes en lote
 * 
 * @param estudiantes - Array de estudiantes para análisis
 * @returns Predicciones en lote
 */
export async function predecirRendimientoBatch(
  estudiantes: EstudianteAIInput[]
): Promise<PrediccionBatchResponse> {
  try {
    const response = await aiApiClient.post<PrediccionBatchResponse>(
      '/predict/batch',
      estudiantes
    );
    return response.data;
  } catch (error) {
    throw handleAIApiError(error);
  }
}

/**
 * Verificar si el servicio de IA está disponible
 * 
 * @returns true si el servicio responde, false en caso contrario
 */
export async function verificarServicioIA(): Promise<boolean> {
  try {
    const response = await aiApiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * Obtener información del servicio de IA
 */
export async function obtenerInfoServicio(): Promise<{
  service: string;
  version: string;
  status: string;
}> {
  try {
    const response = await aiApiClient.get('/');
    return response.data;
  } catch (error) {
    throw handleAIApiError(error);
  }
}

// =====================
// FUNCIONES AUXILIARES
// =====================

/**
 * Mapear nivel de riesgo a color para UI
 */
export function getRiesgoColor(riesgo: 'bajo' | 'medio' | 'alto'): string {
  const colorMap = {
    bajo: '#10b981', // green-500
    medio: '#f59e0b', // amber-500
    alto: '#ef4444', // red-500
  };
  return colorMap[riesgo];
}

/**
 * Mapear nivel de riesgo a texto en español
 */
export function getRiesgoLabel(riesgo: 'bajo' | 'medio' | 'alto'): string {
  const labelMap = {
    bajo: 'Riesgo Bajo',
    medio: 'Riesgo Medio',
    alto: 'Riesgo Alto',
  };
  return labelMap[riesgo];
}

/**
 * Formatear probabilidad como porcentaje
 */
export function formatearProbabilidad(probabilidad: number): string {
  return `${(probabilidad * 100).toFixed(1)}%`;
}

/**
 * Manejo centralizado de errores de la API de IA
 */
function handleAIApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<AIApiError>;
    
    if (axiosError.response) {
      // El servidor respondió con un código de error
      const status = axiosError.response.status;
      const detail = axiosError.response.data?.detail || 'Error desconocido';
      
      if (status === 422) {
        return new Error(`Datos inválidos: ${detail}`);
      } else if (status === 500) {
        return new Error(`Error en el servidor de IA: ${detail}`);
      } else {
        return new Error(`Error ${status}: ${detail}`);
      }
    } else if (axiosError.request) {
      // La petición se hizo pero no hubo respuesta
      return new Error(
        'No se pudo conectar con el servicio de IA. Asegúrate de que predictor_api.py esté ejecutándose en http://localhost:8000'
      );
    } else {
      // Error al configurar la petición
      return new Error(`Error de configuración: ${axiosError.message}`);
    }
  }
  
  // Error desconocido
  return new Error('Error desconocido al comunicarse con el servicio de IA');
}

// =====================
// UTILIDADES DE DATOS
// =====================

/**
 * Validar que los datos del estudiante son válidos antes de enviar
 */
export function validarDatosEstudiante(estudiante: EstudianteAIInput): {
  valido: boolean;
  errores: string[];
} {
  const errores: string[] = [];
  
  if (!estudiante.id_estudiante) {
    errores.push('ID de estudiante requerido');
  }
  
  if (estudiante.notas_promedio < 0 || estudiante.notas_promedio > 10) {
    errores.push('Notas promedio debe estar entre 0 y 10');
  }
  
  if (estudiante.asistencia_porcentaje < 0 || estudiante.asistencia_porcentaje > 100) {
    errores.push('Asistencia debe estar entre 0 y 100');
  }
  
  if (estudiante.horas_estudio_semana < 0 || estudiante.horas_estudio_semana > 168) {
    errores.push('Horas de estudio debe estar entre 0 y 168');
  }
  
  return {
    valido: errores.length === 0,
    errores,
  };
}

/**
 * Crear un objeto de entrada de ejemplo para pruebas
 */
export function crearEstudianteEjemplo(): EstudianteAIInput {
  return {
    id_estudiante: '1234567890',
    nombres: 'Juan',
    apellidos: 'Pérez',
    semestre_actual: 3,
    notas_promedio: 7.5,
    notas_examenes_promedio: 7.0,
    entregas_tareas_porcentaje: 85,
    asistencia_porcentaje: 90,
    horas_estudio_semana: 12,
    participacion_clase: 'media',
    usa_tecnicas_estudio: true,
  };
}

// =====================
// EXPORT DEFAULT
// =====================

export default {
  predecirRendimiento,
  predecirRendimientoBatch,
  verificarServicioIA,
  obtenerInfoServicio,
  getRiesgoColor,
  getRiesgoLabel,
  formatearProbabilidad,
  validarDatosEstudiante,
  crearEstudianteEjemplo,
};
