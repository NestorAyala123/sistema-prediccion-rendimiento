import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudiantesService, prediccionesService } from '../services/api';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Estudiante {
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  promedio_general?: number;
  semestre_actual?: number;
}

interface Prediccion {
  id_estudiante: string;
  nivel_riesgo: string;
  probabilidad_riesgo?: number;
  factores?: any;
}

const GenerarPredicciones: React.FC = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [prediccionGenerada, setPrediccionGenerada] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarEstudiantes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await estudiantesService.getAll();
      setEstudiantes(data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEstudiantes();
  }, [cargarEstudiantes]);

  const handleGenerarPrediccion = async () => {
    if (!estudianteSeleccionado) {
      setError('Por favor selecciona un estudiante');
      return;
    }

    try {
      setGenerando(true);
      setError('');
      setSuccess('');
      setPrediccionGenerada(null);

      const estudiante = estudiantes.find(e => e.id_estudiante === estudianteSeleccionado);
      
      const resultado = await prediccionesService.generate(estudianteSeleccionado);

      setPrediccionGenerada(resultado);
      setSuccess(`✅ Predicción generada exitosamente para ${estudiante?.nombres} ${estudiante?.apellidos}`);
      
      // Limpiar selección después de 3 segundos
      setTimeout(() => {
        setEstudianteSeleccionado('');
        setPrediccionGenerada(null);
        setSuccess('');
      }, 5000);
    } catch (err: any) {
      console.error('Error al generar predicción:', err);
      setError(err.response?.data?.message || 'Error al generar la predicción. Por favor intenta de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  const getRiesgoColor = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'alto':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'bajo':
        return 'text-green-600 bg-green-100 border-green-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRiesgoIcon = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'alto':
        return '🔴';
      case 'medio':
        return '🟡';
      case 'bajo':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/docente/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-purple-600" />
            Generar Predicciones de Riesgo
          </h1>
          <p className="text-gray-600 mt-2">
            Analiza el riesgo académico de tus estudiantes usando inteligencia artificial
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seleccionar Estudiante</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estudiante <span className="text-red-500">*</span>
            </label>
            <select
              value={estudianteSeleccionado}
              onChange={(e) => setEstudianteSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={generando}
            >
              <option value="">Seleccionar estudiante...</option>
              {estudiantes.map((estudiante) => (
                <option key={estudiante._id} value={estudiante.id_estudiante}>
                  {estudiante.nombres} {estudiante.apellidos} - {estudiante.id_estudiante}
                  {estudiante.promedio_general ? ` (Promedio: ${estudiante.promedio_general})` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerarPrediccion}
            disabled={!estudianteSeleccionado || generando}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            {generando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generando predicción...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Generar Predicción con IA
              </>
            )}
          </button>
        </div>

        {/* Resultado de la predicción */}
        {prediccionGenerada && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
              Resultado de la Predicción
            </h2>
            
            <div className="space-y-4">
              {/* Nivel de Riesgo */}
              <div className={`p-6 rounded-lg border-2 ${getRiesgoColor(prediccionGenerada.nivel_riesgo)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium uppercase">Nivel de Riesgo</span>
                  <span className="text-3xl">{getRiesgoIcon(prediccionGenerada.nivel_riesgo)}</span>
                </div>
                <p className="text-3xl font-bold">{prediccionGenerada.nivel_riesgo}</p>
                {prediccionGenerada.probabilidad_riesgo && (
                  <p className="text-sm mt-2 opacity-80">
                    Probabilidad: {(prediccionGenerada.probabilidad_riesgo * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Factores */}
              {prediccionGenerada.factores && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Factores Analizados:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(prediccionGenerada.factores).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-600 uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-lg font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendaciones */}
              {prediccionGenerada.recomendaciones && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📋 Recomendaciones:</h3>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    {prediccionGenerada.recomendaciones.map((rec: string, idx: number) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-3">ℹ️ Información Importante</h3>
          <ul className="space-y-2 text-purple-800 text-sm">
            <li>• La predicción se basa en datos históricos y patrones de aprendizaje</li>
            <li>• Los estudiantes recibirán una notificación automáticamente</li>
            <li>• La predicción se actualiza en tiempo real en el dashboard del estudiante</li>
            <li>• Puedes generar predicciones múltiples para diferentes estudiantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerarPredicciones;
