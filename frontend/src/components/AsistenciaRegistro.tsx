import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudiantesService, asignaturasService, asistenciasService } from '../services/api';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Estudiante {
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
}

interface Asignatura {
  _id: string;
  id_asignatura: string;
  nombre_asignatura: string;
  creditos?: number;
  semestre?: number;
}

interface AsistenciaEstudiante {
  id_estudiante: string;
  presente: boolean;
}

const AsistenciaRegistro: React.FC = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencias, setAsistencias] = useState<AsistenciaEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [estudiantesData, asignaturasData] = await Promise.all([
        estudiantesService.getAll(),
        asignaturasService.getAll(),
      ]);
      setEstudiantes(estudiantesData);
      setAsignaturas(asignaturasData);
      
      // Inicializar todas las asistencias como presentes por defecto
      setAsistencias(
        estudiantesData.map(e => ({
          id_estudiante: e.id_estudiante,
          presente: true,
        }))
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const toggleAsistencia = (id_estudiante: string) => {
    setAsistencias(prev =>
      prev.map(a =>
        a.id_estudiante === id_estudiante
          ? { ...a, presente: !a.presente }
          : a
      )
    );
  };

  const marcarTodos = (presente: boolean) => {
    setAsistencias(prev =>
      prev.map(a => ({ ...a, presente }))
    );
  };

  const handleGuardar = async () => {
    if (!asignaturaSeleccionada) {
      alert('Por favor selecciona una asignatura');
      return;
    }

    try {
      setGuardando(true);
      
      // Preparar los datos para el backend
      const asistenciasParaGuardar = asistencias.map(a => ({
        id_estudiante: a.id_estudiante,
        estado: a.presente ? 'Presente' : 'Ausente',
      }));

      // Enviar al backend
      const resultado = await asistenciasService.createLote({
        id_asignatura: asignaturaSeleccionada,
        fecha_clase: fecha,
        periodo_academico: '2025-01', // Podrías hacerlo dinámico
        asistencias: asistenciasParaGuardar,
      });

      console.log('Resultado del guardado:', resultado);
      
      alert(`✅ Asistencia registrada exitosamente!\n\n` +
            `✓ ${resultado.exitosos} registros guardados\n` +
            (resultado.fallidos > 0 ? `⚠ ${resultado.fallidos} fallidos` : ''));
      
      navigate('/docente/dashboard');
    } catch (error) {
      console.error('Error al guardar asistencias:', error);
      alert('❌ Error al guardar las asistencias. Por favor intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const totalPresentes = asistencias.filter(a => a.presente).length;
  const totalAusentes = asistencias.filter(a => !a.presente).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/docente/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Registro de Asistencia</h1>
          <p className="text-gray-600 mt-2">Registra la asistencia de tus estudiantes</p>
        </div>

        {/* Formulario de Selección */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <select
                value={asignaturaSeleccionada}
                onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar asignatura</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura._id} value={asignatura.id_asignatura}>
                    {asignatura.id_asignatura} - {asignatura.nombre_asignatura}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Presentes: <span className="text-green-600 font-bold">{totalPresentes}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium text-gray-700">
                  Ausentes: <span className="text-red-600 font-bold">{totalAusentes}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => marcarTodos(true)}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                Marcar Todos
              </button>
              <button
                onClick={() => marcarTodos(false)}
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Desmarcar Todos
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Lista de Estudiantes ({estudiantes.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {estudiantes.map((estudiante) => {
                const asistencia = asistencias.find(
                  a => a.id_estudiante === estudiante.id_estudiante
                );
                const presente = asistencia?.presente ?? true;

                return (
                  <div
                    key={estudiante._id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      presente
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          presente ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {estudiante.nombres.charAt(0)}
                        {estudiante.apellidos.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {estudiante.nombres} {estudiante.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">{estudiante.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAsistencia(estudiante.id_estudiante)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        presente
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {presente ? 'Presente' : 'Ausente'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => navigate('/docente/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || !asignaturaSeleccionada}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? 'Guardando...' : 'Guardar Asistencia'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaRegistro;
