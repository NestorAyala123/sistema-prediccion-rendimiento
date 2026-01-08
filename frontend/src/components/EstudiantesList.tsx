import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { estudiantesService, prediccionesService } from '../services/api';
import { ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Estudiante {
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  promedio_general?: number;
  semestre_actual?: number;
  telefono?: string;
}

interface Prediccion {
  id_estudiante: string;
  nivel_riesgo: string;
  probabilidad_riesgo?: number;
}

const EstudiantesList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroRiesgo, setFiltroRiesgo] = useState<string>('todos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [estudiantesData, prediccionesData] = await Promise.all([
        estudiantesService.getAll(),
        prediccionesService.getAll(),
      ]);
      setEstudiantes(estudiantesData);
      setPredicciones(prediccionesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiesgoEstudiante = (id_estudiante: string): string => {
    const prediccion = predicciones.find(p => p.id_estudiante === id_estudiante);
    return prediccion?.nivel_riesgo || 'Sin evaluar';
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo?.toLowerCase()) {
      case 'alto':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'bajo':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    const matchSearch = 
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filtroRiesgo === 'todos') return matchSearch;

    const riesgo = getRiesgoEstudiante(estudiante.id_estudiante);
    return matchSearch && riesgo.toLowerCase() === filtroRiesgo.toLowerCase();
  });

  // Estadísticas
  const totalEstudiantes = estudiantes.length;
  const enRiesgoAlto = estudiantes.filter(e => getRiesgoEstudiante(e.id_estudiante).toLowerCase() === 'alto').length;
  const enRiesgoMedio = estudiantes.filter(e => getRiesgoEstudiante(e.id_estudiante).toLowerCase() === 'medio').length;
  const enRiesgoBajo = estudiantes.filter(e => getRiesgoEstudiante(e.id_estudiante).toLowerCase() === 'bajo').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/docente/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mis Estudiantes</h1>
          <p className="text-gray-600 mt-2">Lista completa de todos tus estudiantes</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalEstudiantes}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Riesgo Alto</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{enRiesgoAlto}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Riesgo Medio</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{enRiesgoMedio}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Riesgo Bajo</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{enRiesgoBajo}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Riesgo */}
            <div className="relative">
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filtroRiesgo}
                onChange={(e) => setFiltroRiesgo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="todos">Todos los niveles de riesgo</option>
                <option value="alto">Riesgo Alto</option>
                <option value="medio">Riesgo Medio</option>
                <option value="bajo">Riesgo Bajo</option>
                <option value="sin evaluar">Sin Evaluar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Estudiantes ({estudiantesFiltrados.length})
            </h2>
          </div>
          <div className="p-6">
            {estudiantesFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron estudiantes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {estudiantesFiltrados.map((estudiante) => {
                  const riesgo = getRiesgoEstudiante(estudiante.id_estudiante);
                  const promedio = estudiante.promedio_general || 0;

                  return (
                    <div
                      key={estudiante._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {estudiante.nombres.charAt(0)}
                          {estudiante.apellidos.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {estudiante.nombres} {estudiante.apellidos}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getRiesgoColor(riesgo)}`}>
                              {riesgo}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{estudiante.email}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">
                              📊 Promedio: <span className="font-semibold text-gray-700">{promedio.toFixed(2)}</span>
                            </span>
                            {estudiante.semestre_actual && (
                              <span className="text-sm text-gray-500">
                                🎓 Semestre: <span className="font-semibold text-gray-700">{estudiante.semestre_actual}</span>
                              </span>
                            )}
                            {estudiante.telefono && (
                              <span className="text-sm text-gray-500">
                                📞 {estudiante.telefono}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/docente/estudiante/${estudiante._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudiantesList;
