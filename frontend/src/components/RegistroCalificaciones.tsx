import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CalendarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface Asignatura {
  id_asignatura: string;
  nombre_asignatura: string;
  creditos: number;
}

interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
}

interface Calificacion {
  id_calificacion?: string;
  tipo_evaluacion: string;
  nota: number;
  fecha_registro?: string;
}

const RegistroCalificaciones: React.FC = () => {
  const { user } = useAuth();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [periodoAcademico, setPeriodoAcademico] = useState('2025-01');
  const [tipoEvaluacion, setTipoEvaluacion] = useState('');
  const [nota, setNota] = useState('');
  const [calificaciones, setCalificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const tiposEvaluacion = [
    'Parcial 1',
    'Parcial 2',
    'Parcial 3',
    'Examen Final',
    'Deber',
    'Proyecto',
    'Participación',
    'Laboratorio',
    'Exposición',
  ];

  useEffect(() => {
    cargarAsignaturas();
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    if (selectedAsignatura && periodoAcademico) {
      cargarCalificacionesPorAsignaturaYPeriodo();
    }
  }, [selectedAsignatura, periodoAcademico]);

  const cargarAsignaturas = async () => {
    try {
      // Aquí conectarás con tu API
      // const response = await fetch('http://localhost:3001/asignaturas', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Datos de demostración
      setAsignaturas([
        { id_asignatura: 'MAT-101', nombre_asignatura: 'Matemáticas I', creditos: 4 },
        { id_asignatura: 'FIS-101', nombre_asignatura: 'Física I', creditos: 4 },
        { id_asignatura: 'PRG-101', nombre_asignatura: 'Programación I', creditos: 5 },
        { id_asignatura: 'BDD-101', nombre_asignatura: 'Base de Datos', creditos: 4 },
      ]);
    } catch (err) {
      console.error('Error al cargar asignaturas:', err);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      // Aquí conectarás con tu API
      // const response = await fetch('http://localhost:3001/estudiantes', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Datos de demostración
      setEstudiantes([
        { id_estudiante: 'EST-001', nombres: 'Juan', apellidos: 'Pérez', email: 'juan@test.com' },
        { id_estudiante: 'EST-002', nombres: 'María', apellidos: 'García', email: 'maria@test.com' },
        { id_estudiante: 'EST-003', nombres: 'Carlos', apellidos: 'López', email: 'carlos@test.com' },
      ]);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
    }
  };

  const cargarCalificacionesPorAsignaturaYPeriodo = async () => {
    try {
      setLoading(true);
      // Aquí conectarás con tu API
      // const response = await fetch(
      //   `http://localhost:3001/calificaciones/asignatura/${selectedAsignatura}/periodo/${periodoAcademico}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // const data = await response.json();
      
      // Datos de demostración
      setCalificaciones([
        {
          estudiante: { id: 'EST-001', nombres: 'Juan', apellidos: 'Pérez', email: 'juan@test.com' },
          calificaciones: [
            { id_calificacion: '1', tipo_evaluacion: 'Parcial 1', nota: 85, fecha_registro: '2025-01-15' },
            { id_calificacion: '2', tipo_evaluacion: 'Deber', nota: 90, fecha_registro: '2025-01-20' },
          ],
          promedio: 87.5,
        },
      ]);
    } catch (err) {
      console.error('Error al cargar calificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedEstudiante || !selectedAsignatura || !periodoAcademico || !tipoEvaluacion || !nota) {
      setError('Por favor complete todos los campos');
      return;
    }

    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 100) {
      setError('La nota debe estar entre 0 y 100');
      return;
    }

    try {
      setLoading(true);
      
      // Aquí conectarás con tu API
      // const response = await fetch('http://localhost:3001/calificaciones/por-periodo', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     id_estudiante: selectedEstudiante,
      //     id_asignatura: selectedAsignatura,
      //     periodo_academico: periodoAcademico,
      //     tipo_evaluacion: tipoEvaluacion,
      //     nota: notaNum,
      //   }),
      // });

      // if (!response.ok) throw new Error('Error al registrar calificación');

      setSuccess('Calificación registrada exitosamente');
      setTipoEvaluacion('');
      setNota('');
      setShowForm(false);
      cargarCalificacionesPorAsignaturaYPeriodo();
    } catch (err: any) {
      setError(err.message || 'Error al registrar calificación');
    } finally {
      setLoading(false);
    }
  };

  const getNivelColor = (nota: number) => {
    if (nota >= 80) return 'text-green-600 bg-green-100';
    if (nota >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registro de Calificaciones</h1>
              <p className="text-sm text-gray-500">Gestión de notas por periodo académico y materia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Periodo Académico
              </label>
              <select
                value={periodoAcademico}
                onChange={(e) => setPeriodoAcademico(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="2025-01">2025-01 (Enero - Mayo)</option>
                <option value="2025-02">2025-02 (Junio - Octubre)</option>
                <option value="2024-02">2024-02 (Junio - Octubre)</option>
                <option value="2024-01">2024-01 (Enero - Mayo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpenIcon className="w-4 h-4 inline mr-1" />
                Asignatura
              </label>
              <select
                value={selectedAsignatura}
                onChange={(e) => setSelectedAsignatura(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccionar asignatura...</option>
                {asignaturas.map((asig) => (
                  <option key={asig.id_asignatura} value={asig.id_asignatura}>
                    {asig.id_asignatura} - {asig.nombre_asignatura}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Nueva Calificación
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de registro */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Registrar Nueva Calificación</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estudiante <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedEstudiante}
                    onChange={(e) => setSelectedEstudiante(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar estudiante...</option>
                    {estudiantes.map((est) => (
                      <option key={est.id_estudiante} value={est.id_estudiante}>
                        {est.nombres} {est.apellidos} - {est.id_estudiante}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Evaluación <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tipoEvaluacion}
                    onChange={(e) => setTipoEvaluacion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar tipo...</option>
                    {tiposEvaluacion.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nota (0-100) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="85.50"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Calificación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de calificaciones */}
        {selectedAsignatura && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Calificaciones Registradas
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({calificaciones.length} estudiantes)
              </span>
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : calificaciones.length === 0 ? (
              <div className="text-center py-12">
                <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay calificaciones registradas para este periodo y materia</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Calificaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Promedio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {calificaciones.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.estudiante.nombres} {item.estudiante.apellidos}
                            </div>
                            <div className="text-sm text-gray-500">{item.estudiante.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {item.calificaciones.map((cal: Calificacion) => (
                              <div key={cal.id_calificacion} className="text-sm">
                                <span className="font-medium">{cal.tipo_evaluacion}:</span>{' '}
                                <span className={`px-2 py-0.5 rounded ${getNivelColor(cal.nota)}`}>
                                  {cal.nota}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-2xl font-bold ${getNivelColor(item.promedio)}`}>
                            {item.promedio.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <PencilIcon className="w-4 h-4 inline" /> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroCalificaciones;
