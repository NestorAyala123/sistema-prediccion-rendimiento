import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface Estudiante {
  id: string;
  nombre: string;
  promedio: number;
  riesgo: string;
}

const DocenteDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState(0);

  useEffect(() => {
    // Simulación de datos - aquí conectarás con tu API
    setEstudiantes([
      { id: '1', nombre: 'Juan Pérez', promedio: 85, riesgo: 'Bajo' },
      { id: '2', nombre: 'María García', promedio: 72, riesgo: 'Medio' },
      { id: '3', nombre: 'Carlos López', promedio: 55, riesgo: 'Alto' },
      { id: '4', nombre: 'Ana Martínez', promedio: 90, riesgo: 'Bajo' },
      { id: '5', nombre: 'Pedro Rodríguez', promedio: 68, riesgo: 'Medio' },
    ]);
    setMateriasAsignadas(3);
  }, []);

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'Alto':
        return 'text-red-600 bg-red-100';
      case 'Medio':
        return 'text-yellow-600 bg-yellow-100';
      case 'Bajo':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const estudiantesEnRiesgo = estudiantes.filter(e => e.riesgo === 'Alto' || e.riesgo === 'Medio').length;

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
                <p className="text-3xl font-bold text-red-600 mt-2">{estudiantesEnRiesgo}</p>
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
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {Math.round(estudiantes.reduce((acc, e) => acc + e.promedio, 0) / estudiantes.length)}
                </p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => alert('Función en desarrollo')}
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
            onClick={() => alert('Función en desarrollo')}
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
              {estudiantes
                .filter(e => e.riesgo === 'Alto' || e.riesgo === 'Medio')
                .map((estudiante) => (
                  <div key={estudiante.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{estudiante.nombre}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiesgoColor(estudiante.riesgo)}`}>
                          {estudiante.riesgo}
                        </span>
                        <span className="text-sm text-gray-500">Promedio: {estudiante.promedio}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Ver Detalles
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Todos los Estudiantes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-blue-600" />
              Todos Mis Estudiantes
            </h2>
            <div className="space-y-3">
              {estudiantes.map((estudiante) => (
                <div key={estudiante.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{estudiante.nombre}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRiesgoColor(estudiante.riesgo)}`}>
                        {estudiante.riesgo}
                      </span>
                      <span className="text-sm text-gray-500">Promedio: {estudiante.promedio}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${estudiante.promedio >= 80 ? 'text-green-600' : estudiante.promedio >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {estudiante.promedio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-3">📋 Tareas Pendientes</h3>
          <ul className="space-y-2 text-purple-800">
            <li>• Revisar el desempeño de Carlos López (Riesgo Alto)</li>
            <li>• Programar tutoría con María García</li>
            <li>• Registrar calificaciones del último examen</li>
            <li>• Preparar material para la próxima clase</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DocenteDashboard;
