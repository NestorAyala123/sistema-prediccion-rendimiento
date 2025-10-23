import React, { useState, useEffect } from 'react';
import { prediccionesService, estudiantesService } from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

interface Prediccion {
  id_prediccion: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  fecha_prediccion: string;
  nivel_riesgo: string;
  factores_clave: string;
  estado_prediccion: string;
}

interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
}

const Predicciones: React.FC = () => {
  const { t } = useTranslation();
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [generatingPrediction, setGeneratingPrediction] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await prediccionesService.getAll();
        setPredicciones(
          data.map((p: any) => ({
            id_prediccion: p.id_prediccion,
            id_estudiante: p.id_estudiante,
            nombres: p.estudiante?.nombres || '',
            apellidos: p.estudiante?.apellidos || '',
            fecha_prediccion: p.fecha_prediccion
              ? new Date(p.fecha_prediccion).toISOString().split('T')[0]
              : '',
            nivel_riesgo: p.nivel_riesgo,
            factores_clave: p.factores_clave,
            estado_prediccion: p.estado_prediccion,
          }))
        );
      } catch (err) {
        console.error('Error al cargar predicciones:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleGenerarNuevas = async () => {
    setShowModal(true);
    setStudentId('');
    // Cargar lista de estudiantes cuando se abre el modal
    try {
      setLoadingStudents(true);
      const data = await estudiantesService.getAll();
      setEstudiantes(data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStudentId('');
  };

  const handleSubmitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      alert(t('error') + ': ' + t('selectStudent'));
      return;
    }

    try {
      setGeneratingPrediction(true);
      await prediccionesService.generate(studentId);
      // recargar predicciones
      const data = await prediccionesService.getAll();
      setPredicciones(
        data.map((p: any) => ({
          id_prediccion: p.id_prediccion,
          id_estudiante: p.id_estudiante,
          nombres: p.estudiante?.nombres || '',
          apellidos: p.estudiante?.apellidos || '',
          fecha_prediccion: p.fecha_prediccion
            ? new Date(p.fecha_prediccion).toISOString().split('T')[0]
            : '',
          nivel_riesgo: p.nivel_riesgo,
          factores_clave: p.factores_clave,
          estado_prediccion: p.estado_prediccion,
        }))
      );
      handleCloseModal();
    } catch (err) {
      console.error('Error al generar predicciones:', err);
      alert(t('error') + ': Error al generar predicciones');
    } finally {
      setGeneratingPrediction(false);
    }
  };

  const handleVerDetalles = (prediccion: Prediccion) => {
    alert(
      `Detalles de Predicción\n\nEstudiante: ${prediccion.nombres} ${prediccion.apellidos}\nID: ${prediccion.id_estudiante}\nFecha: ${prediccion.fecha_prediccion}\nNivel de Riesgo: ${prediccion.nivel_riesgo}\nEstado: ${prediccion.estado_prediccion}\n\nFactores Clave:\n${prediccion.factores_clave}`
    );
  };

  const handleGenerarReporte = async (prediccion: Prediccion) => {
    try {
      setGeneratingReport(prediccion.id_prediccion);
      const blob = await prediccionesService.getReport(
        prediccion.id_prediccion
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${prediccion.id_prediccion}-${
        new Date().toISOString().split('T')[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error al descargar reporte:', err);
      alert('El reporte no está disponible aún');
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleRecalcular = (prediccion: Prediccion) => {
    if (
      window.confirm(
        `¿Desea recalcular la predicción para ${prediccion.nombres} ${prediccion.apellidos}?`
      )
    ) {
      alert('Recalculando predicción...');
    }
  };

  const handleEliminarPrediccion = async (prediccion: Prediccion) => {
    if (
      window.confirm(
        `¿Está seguro de que desea eliminar la predicción de ${prediccion.nombres} ${prediccion.apellidos}?`
      )
    ) {
      try {
        await prediccionesService.delete(prediccion.id_prediccion);
        // Recargar predicciones
        const data = await prediccionesService.getAll();
        setPredicciones(
          data.map((p: any) => ({
            id_prediccion: p.id_prediccion,
            id_estudiante: p.id_estudiante,
            nombres: p.estudiante?.nombres || '',
            apellidos: p.estudiante?.apellidos || '',
            fecha_prediccion: p.fecha_prediccion
              ? new Date(p.fecha_prediccion).toISOString().split('T')[0]
              : '',
            nivel_riesgo: p.nivel_riesgo,
            factores_clave: p.factores_clave,
            estado_prediccion: p.estado_prediccion,
          }))
        );
      } catch (err) {
        console.error('Error al eliminar predicción:', err);
        alert('Error al eliminar la predicción');
      }
    }
  };

  const filteredPredicciones = predicciones.filter((prediccion) => {
    if (filter === 'todos') return true;
    return prediccion.nivel_riesgo.toLowerCase() === filter.toLowerCase();
  });

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'Alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bajo':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Calculando':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateRiskLevel = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'alto':
        return t('alto');
      case 'medio':
        return t('medio');
      case 'bajo':
        return t('bajo');
      case 'crítico':
        return t('critico');
      default:
        return nivel;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('managementStudents')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('riskAnalysis')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('generatedPredictions')}
          </h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <label htmlFor="filter-select" className="sr-only">
              Filter predictions by risk level
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">{t('allLevels')}</option>
              <option value="alto">{t('highRisk')}</option>
              <option value="medio">{t('mediumRisk')}</option>
              <option value="bajo">{t('lowRisk')}</option>
            </select>
            <button
              onClick={handleGenerarNuevas}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {t('addPrediction')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPredicciones.map((prediccion) => (
            <div
              key={prediccion.id_prediccion}
              className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {prediccion.nombres} {prediccion.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {prediccion.id_estudiante}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date: {prediccion.fecha_prediccion}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(
                      prediccion.nivel_riesgo
                    )}`}
                  >
                    {translateRiskLevel(prediccion.nivel_riesgo)}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      prediccion.estado_prediccion
                    )}`}
                  >
                    {prediccion.estado_prediccion}
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-md mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {t('keyFactors')}:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {prediccion.factores_clave}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleVerDetalles(prediccion)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium"
                >
                  {t('viewDetails')}
                </button>
                <button
                  onClick={() => handleGenerarReporte(prediccion)}
                  disabled={generatingReport === prediccion.id_prediccion}
                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm font-medium disabled:opacity-50"
                >
                  {generatingReport === prediccion.id_prediccion
                    ? t('loading')
                    : t('generateReport')}
                </button>
                <button
                  onClick={() => handleRecalcular(prediccion)}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 text-sm font-medium"
                >
                  {t('recalculate')}
                </button>
                <button
                  onClick={() => handleEliminarPrediccion(prediccion)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPredicciones.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {t('noPredictionsFound')}
            </p>
          </div>
        )}
      </div>

      {/* Modal para agregar predicción */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('addPrediction')}
              </h2>
              <button
                type="button"
                title="Close modal"
                aria-label="Close modal"
                onClick={handleCloseModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitPrediction}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('selectStudent')} <span className="text-red-500">*</span>
                </label>
                {loadingStudents ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    title="Select a student to generate prediction"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- {t('selectStudent')} --</option>
                    {estudiantes.map((est) => (
                      <option key={est.id_estudiante} value={est.id_estudiante}>
                        {est.nombres} {est.apellidos} (ID: {est.id_estudiante})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={generatingPrediction}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={generatingPrediction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {generatingPrediction ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('loading')}
                    </>
                  ) : (
                    t('generatePrediction')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predicciones;
