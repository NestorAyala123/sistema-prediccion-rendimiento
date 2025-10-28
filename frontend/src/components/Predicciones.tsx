import React, { useState, useEffect } from 'react';
import { prediccionesService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

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

const Predicciones: React.FC = () => {
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPredicciones([
        {
          id_prediccion: 'pred-001',
          id_estudiante: '1234567890',
          nombres: 'Juan',
          apellidos: 'Pérez',
          fecha_prediccion: '2025-01-21',
          nivel_riesgo: 'Alto',
          factores_clave:
            'Bajas notas en Cálculo (3.2/10), 40% de inasistencia, pocas horas de estudio semanales',
          estado_prediccion: 'Completado',
        },
        {
          id_prediccion: 'pred-002',
          id_estudiante: '0987654321',
          nombres: 'Ana',
          apellidos: 'García',
          fecha_prediccion: '2025-01-20',
          nivel_riesgo: 'Bajo',
          factores_clave:
            'Buenas calificaciones (8.5/10), asistencia regular, técnicas de estudio efectivas',
          estado_prediccion: 'Completado',
        },
        {
          id_prediccion: 'pred-003',
          id_estudiante: '1122334455',
          nombres: 'Luis',
          apellidos: 'Martínez',
          fecha_prediccion: '2025-01-21',
          nivel_riesgo: 'Medio',
          factores_clave:
            'Calificaciones promedio (6.8/10), algunas faltas justificadas, estudio irregular',
          estado_prediccion: 'Completado',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerarNuevas = async () => {
    try {
      // Placeholder para generar nuevas predicciones
      alert(
        t('predicciones.alertGenerarNuevas')
      );
    } catch (err) {
      console.error('Error al generar predicciones:', err);
      alert('Error al generar predicciones');
    }
  };

  const handleVerDetalles = (prediccion: Prediccion) => {
    alert(`${t('predicciones.verDetallesDe')}: ${prediccion.id_prediccion}`);
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
      alert(t('predicciones.errorDescargar'));
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleRecalcular = (prediccion: Prediccion) => {
    if (
      window.confirm(
        `${t('predicciones.confirmRecalcular')}: ${prediccion.nombres} ${prediccion.apellidos}?`
      )
    ) {
      alert(t('predicciones.recalculando'));
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
        <h1 className="text-3xl font-bold text-gray-900">{t('predicciones.title')}</h1>
        <p className="text-gray-600">{t('predicciones.subtitle')}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('predicciones.generadasTitulo')}</h2>
          <div className="flex space-x-4">
            <label htmlFor="filter-select" className="sr-only">
              {t('predicciones.filtrarLabel')}
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">{t('predicciones.optionTodos')}</option>
              <option value="alto">{t('predicciones.optionAlto')}</option>
              <option value="medio">{t('predicciones.optionMedio')}</option>
              <option value="bajo">{t('predicciones.optionBajo')}</option>
            </select>
            <button
              onClick={handleGenerarNuevas}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('predicciones.generarNuevas')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPredicciones.map((prediccion) => (
            <div
              key={prediccion.id_prediccion}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {prediccion.nombres} {prediccion.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: {prediccion.id_estudiante}
                  </p>
                  <p className="text-sm text-gray-500">{t('predicciones.fecha')}: {prediccion.fecha_prediccion}</p>
                </div>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(
                      prediccion.nivel_riesgo
                    )}`}
                  >
                    {prediccion.nivel_riesgo}
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

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('predicciones.factoresClave')}:</h4>
                <p className="text-sm text-gray-600">
                  {prediccion.factores_clave}
                </p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleVerDetalles(prediccion)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  {t('predicciones.verDetalles')}
                </button>
                <button
                  onClick={() => handleGenerarReporte(prediccion)}
                  disabled={generatingReport === prediccion.id_prediccion}
                  className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                >
                  {generatingReport === prediccion.id_prediccion
                    ? t('predicciones.descargando')
                    : t('predicciones.generarReporte')}
                </button>
                <button
                  onClick={() => handleRecalcular(prediccion)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  {t('predicciones.recalcular')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPredicciones.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('predicciones.noEncontradas')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predicciones;
