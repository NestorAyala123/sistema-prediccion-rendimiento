import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRealTimeEvent } from '../contexts/RealTimeContext';
import { prediccionesService } from '../services/api';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Calificacion {
  materia: string;
  nota: number;
  semestre: number;
}

interface Asistencia {
  materia: string;
  porcentaje: number;
}

interface Prediccion {
  _id?: string;
  id_prediccion?: string;
  id_estudiante: string;
  nivel_riesgo: string;
  probabilidad?: number;
  factores_analizados?: any;
  factores_clave?: string;
  recomendaciones?: string[];
  fecha_prediccion?: string;
  estado_prediccion?: string;
}

const EstudianteDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [prediccionActual, setPrediccionActual] = useState<Prediccion | null>(null);
  const [loadingPrediccion, setLoadingPrediccion] = useState(true);

  // 🔴 Escuchar eventos en tiempo real para actualizar calificaciones
  useRealTimeEvent('calificacion:created', (data) => {
    // Verificar si la calificación es para este estudiante
    if (data.id_estudiante === (user as any)?._id || data.id_estudiante === (user as any)?.id_estudiante) {
      console.log('📝 Nueva calificación recibida para ti:', data);
      // Aquí podrías recargar las calificaciones o actualizar el estado
    }
  });

  useRealTimeEvent('asistencia:created', (data) => {
    if (data.id_estudiante === (user as any)?._id || data.id_estudiante === (user as any)?.id_estudiante) {
      console.log('✔️ Asistencia actualizada para ti:', data);
    }
  });

  // 🔴 Escuchar nuevas predicciones en tiempo real
  useRealTimeEvent('prediccion:created', (data) => {
    if (data.id_estudiante === (user as any)?._id || data.id_estudiante === (user as any)?.id_estudiante) {
      console.log('🔮 Nueva predicción recibida:', data);
      setPrediccionActual(data);
    }
  });

  const cargarPredicciones = async () => {
    try {
      setLoadingPrediccion(true);
      const idEstudiante = (user as any)?.id_estudiante || (user as any)?._id;
      if (idEstudiante) {
        const predicciones = await prediccionesService.getByEstudiante(idEstudiante);
        if (predicciones && predicciones.length > 0) {
          // Obtener la predicción más reciente
          const prediccionMasReciente = predicciones.sort((a: any, b: any) => 
            new Date(b.fecha_prediccion || b.createdAt).getTime() - 
            new Date(a.fecha_prediccion || a.createdAt).getTime()
          )[0];
          setPrediccionActual(prediccionMasReciente);
        }
      }
    } catch (error) {
      console.error('Error al cargar predicciones:', error);
    } finally {
      setLoadingPrediccion(false);
    }
  };

  const getNivelRiesgo = (promedio: number) => {
    if (promedio >= 80) return { nivel: t('estudiante.riesgoBajo'), color: 'text-green-600', bg: 'bg-green-100' };
    if (promedio >= 60) return { nivel: t('estudiante.riesgoMedio'), color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { nivel: t('estudiante.riesgoAlto'), color: 'text-red-600', bg: 'bg-red-100' };
  };

  useEffect(() => {
    // Cargar predicciones del estudiante
    cargarPredicciones();
    
    // Simulación de datos - aquí conectarás con tu API
    const calificacionesIniciales = [
      { materia: 'Matemáticas', nota: 85, semestre: 1 },
      { materia: 'Física', nota: 78, semestre: 1 },
      { materia: 'Programación', nota: 92, semestre: 1 },
      { materia: 'Base de Datos', nota: 88, semestre: 1 },
    ];

    const asistenciasIniciales = [
      { materia: 'Matemáticas', porcentaje: 95 },
      { materia: 'Física', porcentaje: 87 },
      { materia: 'Programación', porcentaje: 98 },
      { materia: 'Base de Datos', porcentaje: 92 },
    ];

    setCalificaciones(calificacionesIniciales);
    setAsistencias(asistenciasIniciales);

    // Calcular promedio con los datos iniciales
    const promedio = calificacionesIniciales.reduce((acc, cal) => acc + cal.nota, 0) / calificacionesIniciales.length || 0;
    setPromedioGeneral(Math.round(promedio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riesgo = getNivelRiesgo(promedioGeneral);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('estudiante.portalTitle')}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('estudiante.bienvenido')}, {user?.nombres} {user?.apellidos}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>{t('estudiante.cerrarSesion')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Predicción Actual */}
        {prediccionActual && (
          <div className={`mb-8 rounded-lg shadow-lg border-2 p-6 ${
            prediccionActual.nivel_riesgo === 'Alto' 
              ? 'bg-red-50 border-red-300' 
              : prediccionActual.nivel_riesgo === 'Medio' 
              ? 'bg-yellow-50 border-yellow-300' 
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <SparklesIcon className={`w-8 h-8 ${
                  prediccionActual.nivel_riesgo === 'Alto' 
                    ? 'text-red-600' 
                    : prediccionActual.nivel_riesgo === 'Medio' 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
                }`} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Predicción de Rendimiento
                  </h2>
                  <p className="text-sm text-gray-600">
                    Última actualización: {prediccionActual.fecha_prediccion ? new Date(prediccionActual.fecha_prediccion).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold ${
                prediccionActual.nivel_riesgo === 'Alto' 
                  ? 'bg-red-200 text-red-800' 
                  : prediccionActual.nivel_riesgo === 'Medio' 
                  ? 'bg-yellow-200 text-yellow-800' 
                  : 'bg-green-200 text-green-800'
              }`}>
                Riesgo: {prediccionActual.nivel_riesgo}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Probabilidad de Riesgo</p>
                <p className="text-4xl font-bold text-gray-900">
                  {((prediccionActual.probabilidad || 0) * 100).toFixed(1)}%
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      prediccionActual.nivel_riesgo === 'Alto' 
                        ? 'bg-red-500' 
                        : prediccionActual.nivel_riesgo === 'Medio' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(prediccionActual.probabilidad || 0) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Factores Analizados</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(prediccionActual.factores_analizados || {}).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-semibold text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {prediccionActual.recomendaciones && prediccionActual.recomendaciones.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span> Recomendaciones Personalizadas
                </h3>
                <ul className="space-y-2">
                  {prediccionActual.recomendaciones.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('estudiante.promedioGeneral')}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{promedioGeneral}</p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('estudiante.nivelRiesgo')}</p>
                <p className={`text-2xl font-bold mt-2 ${riesgo.color}`}>{riesgo.nivel}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${riesgo.bg} flex items-center justify-center`}>
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('estudiante.materias')}</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{calificaciones.length}</p>
              </div>
              <BookOpenIcon className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('estudiante.asistenciaPromedio')}</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {Math.round(asistencias.reduce((acc, a) => acc + a.porcentaje, 0) / asistencias.length)}%
                </p>
              </div>
              <ClipboardDocumentListIcon className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calificaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
              {t('estudiante.misCalificaciones')}
            </h2>
            <div className="space-y-4">
              {calificaciones.map((cal, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{cal.materia}</p>
                    <p className="text-sm text-gray-500">{t('estudiante.semestre')} {cal.semestre}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${cal.nota >= 80 ? 'text-green-600' : cal.nota >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {cal.nota}
                    </p>
                    <p className="text-xs text-gray-500">/ 100</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asistencias */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
              {t('estudiante.miAsistencia')}
            </h2>
            <div className="space-y-4">
              {asistencias.map((asist, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{asist.materia}</p>
                    <p className={`font-bold ${asist.porcentaje >= 85 ? 'text-green-600' : asist.porcentaje >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {asist.porcentaje}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${asist.porcentaje >= 85 ? 'bg-green-600' : asist.porcentaje >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${asist.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 {t('estudiante.recomendacionesPersonalizadas')}</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• {t('estudiante.recomendacion1')}</li>
            <li>• {t('estudiante.recomendacion2')}</li>
            <li>• {t('estudiante.recomendacion3')}</li>
            <li>• {t('estudiante.recomendacion4')}</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EstudianteDashboard;
