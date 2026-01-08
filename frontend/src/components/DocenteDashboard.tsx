import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRealTimeEvent } from '../contexts/RealTimeContext';
import { useNavigate } from 'react-router-dom';
import { estudiantesService, prediccionesService, asignaturasService, asistenciasService } from '../services/api';
import {
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

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
}

const DocenteDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState(0);
  const [totalAsistencias, setTotalAsistencias] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  // 🔴 Escuchar eventos en tiempo real
  useRealTimeEvent('calificacion:created', (data) => {
    console.log('📝 Nueva calificación creada:', data);
    // Recargar datos para actualizar las estadísticas
    cargarDatos();
  });

  useRealTimeEvent('asistencia:created', (data) => {
    console.log('✔️ Nueva asistencia registrada:', data);
    cargarDatos();
  });

  useRealTimeEvent('asistencia:lote', (data) => {
    console.log('📊 Asistencia en lote registrada:', data);
    cargarDatos();
  });

  useRealTimeEvent('notification', (notification) => {
    console.log('🔔 Notificación recibida:', notification);
    // Aquí podrías mostrar una notificación toast
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Cargar estudiantes
      const estudiantesData = await estudiantesService.getAll();
      setEstudiantes(estudiantesData);

      // Cargar predicciones
      const prediccionesData = await prediccionesService.getAll();
      setPredicciones(prediccionesData);

      // Cargar asignaturas
      const asignaturasData = await asignaturasService.getAll();
      setMateriasAsignadas(asignaturasData.length);

      // Cargar asistencias
      const asistenciasData = await asistenciasService.getAll();
      setTotalAsistencias(asistenciasData.length);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo?.toLowerCase()) {
      case 'alto':
        return 'text-red-600 bg-red-100';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100';
      case 'bajo':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiesgoEstudiante = (id_estudiante: string): string => {
    const prediccion = predicciones.find(p => p.id_estudiante === id_estudiante);
    return prediccion?.nivel_riesgo || 'N/A';
  };

  const estudiantesConRiesgo = estudiantes.filter(e => {
    const riesgo = getRiesgoEstudiante(e.id_estudiante);
    return riesgo === 'Alto' || riesgo === 'Medio';
  });

  const promedioGeneral = estudiantes.length > 0
    ? Math.round(estudiantes.reduce((acc, e) => acc + (e.promedio_general || 0), 0) / estudiantes.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Portal Docente
                </h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, Prof. {user?.nombres} {user?.apellidos}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{estudiantes.length}</p>
              </div>
              <UsersIcon className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Riesgo</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{estudiantesConRiesgo.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materias</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{materiasAsignadas}</p>
              </div>
              <BookOpenIcon className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Curso</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{promedioGeneral}</p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/docente/asistencia')}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <ClipboardDocumentCheckIcon className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Registrar Asistencia</h3>
            <p className="text-sm text-gray-600">Tomar asistencia del día</p>
          </button>

          <button 
            onClick={() => navigate('/docente/calificaciones')}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <ChartBarIcon className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Registrar Calificaciones</h3>
            <p className="text-sm text-gray-600">Ingresar notas de evaluaciones</p>
          </button>

          <button
            onClick={() => navigate('/docente/estudiantes')}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
            <UsersIcon className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ver Mis Estudiantes</h3>
            <p className="text-sm text-gray-600">Lista completa de estudiantes</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estudiantes en Riesgo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Estudiantes que Requieren Atención
            </h2>
            <div className="space-y-3">
              {estudiantesConRiesgo.length > 0 ? (
                estudiantesConRiesgo.map((estudiante) => {
                  const riesgo = getRiesgoEstudiante(estudiante.id_estudiante);
                  return (
                    <div key={estudiante._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{estudiante.nombres} {estudiante.apellidos}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiesgoColor(riesgo)}`}>
                            {riesgo}
                          </span>
                          <span className="text-sm text-gray-500">Promedio: {estudiante.promedio_general || 0}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/docente/estudiante/${estudiante._id}`)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Ver Detalles
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No hay estudiantes en riesgo</p>
              )}
            </div>
          </div>

          {/* Todos los Estudiantes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-blue-600" />
              Todos Mis Estudiantes
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {estudiantes.map((estudiante) => {
                const riesgo = getRiesgoEstudiante(estudiante.id_estudiante);
                const promedio = estudiante.promedio_general || 0;
                return (
                  <div key={estudiante._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{estudiante.nombres} {estudiante.apellidos}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiesgoColor(riesgo)}`}>
                          {riesgo}
                        </span>
                        <span className="text-sm text-gray-500">Promedio: {promedio}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${promedio >= 80 ? 'text-green-600' : promedio >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {promedio}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        {estudiantesConRiesgo.length > 0 && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-3">📋 Acciones Recomendadas</h3>
            <ul className="space-y-2 text-purple-800">
              {estudiantesConRiesgo.slice(0, 3).map((est, idx) => (
                <li key={idx}>• Revisar el desempeño de {est.nombres} {est.apellidos} (Riesgo {getRiesgoEstudiante(est.id_estudiante)})</li>
              ))}
              <li>• Registrar calificaciones del último examen</li>
              <li>• Actualizar asistencia de la semana</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocenteDashboard;
