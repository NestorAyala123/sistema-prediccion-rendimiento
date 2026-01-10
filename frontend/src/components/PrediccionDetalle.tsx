import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const PrediccionDetalle: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prediccion = location.state?.prediccion;

  if (!prediccion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Predicción no encontrada</h2>
          <p className="text-gray-500 mb-4">No se pudo cargar la información de la predicción.</p>
          <button
            onClick={() => navigate('/estudiante/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getRiesgoColor = (nivel: string) => {
    const nivelLower = nivel?.toLowerCase() || 'medio';
    if (nivelLower === 'alto') {
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />,
      };
    }
    if (nivelLower === 'medio') {
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        icon: <ChartBarIcon className="w-12 h-12 text-yellow-600" />,
      };
    }
    return {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: <CheckCircleIcon className="w-12 h-12 text-green-600" />,
    };
  };

  const riesgoStyle = getRiesgoColor(prediccion.nivel_riesgo);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Predicción de Riesgo</h1>
          <p className="text-gray-600 mt-2">
            Fecha: {new Date(prediccion.fecha_prediccion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Nivel de Riesgo Principal */}
        <div className={`${riesgoStyle.bg} ${riesgoStyle.border} border-2 rounded-xl p-8 mb-6`}>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {riesgoStyle.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nivel de Riesgo: <span className={riesgoStyle.text}>{prediccion.nivel_riesgo}</span>
              </h2>
              {prediccion.probabilidad && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2">Probabilidad de Riesgo</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        prediccion.nivel_riesgo?.toLowerCase() === 'alto' ? 'bg-red-600' :
                        prediccion.nivel_riesgo?.toLowerCase() === 'medio' ? 'bg-yellow-500' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${(prediccion.probabilidad * 100).toFixed(0)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {(prediccion.probabilidad * 100).toFixed(1)}% de probabilidad
                  </p>
                </div>
              )}
              {prediccion.puntuacion && (
                <p className="text-sm text-gray-700 mt-2">
                  Puntuación: <span className="font-semibold">{prediccion.puntuacion.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Factores Clave */}
        {prediccion.factores_clave && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> Factores Identificados
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{prediccion.factores_clave}</p>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {prediccion.recomendaciones && prediccion.recomendaciones.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💡</span> Recomendaciones para Mejorar
            </h3>
            <ul className="space-y-3">
              {prediccion.recomendaciones.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Información Adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-lg font-semibold text-gray-900">{prediccion.estado_prediccion || 'Completado'}</p>
            </div>
            {prediccion.modelo_version && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Versión del Modelo</p>
                <p className="text-lg font-semibold text-gray-900">{prediccion.modelo_version}</p>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">ID de Predicción</p>
              <p className="text-sm font-mono text-gray-700">{prediccion.id_prediccion || prediccion._id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estudiante</p>
              <p className="text-sm font-semibold text-gray-900">
                {prediccion.nombres} {prediccion.apellidos}
              </p>
            </div>
          </div>
        </div>

        {/* Nota Informativa */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Esta predicción es generada por un modelo de inteligencia artificial basado en tu rendimiento académico actual. 
            Utiliza esta información como guía para identificar áreas de mejora. Si tienes dudas o necesitas apoyo, no dudes en contactar a tu docente o al departamento de apoyo estudiantil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrediccionDetalle;
