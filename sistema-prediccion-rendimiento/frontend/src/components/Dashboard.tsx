import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudiantesService } from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

interface DashboardStats {
  totalEstudiantes: number;
  totalPredicciones: number;
  riesgoAlto: number;
  riesgoMedio: number;
  riesgoBajo: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalEstudiantes: 0,
    totalPredicciones: 0,
    riesgoAlto: 0,
    riesgoMedio: 0,
    riesgoBajo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        totalEstudiantes: 150,
        totalPredicciones: 45,
        riesgoAlto: 12,
        riesgoMedio: 18,
        riesgoBajo: 15,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleExportData = async () => {
    try {
      const blob = await estudiantesService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estudiantes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error al exportar datos:', err);
      alert('Error al exportar datos');
    }
  };

  const handleGenerateReport = () => {
    // Navegar a la página de predicciones donde se pueden ver/descargar reportes
    navigate('/predicciones');
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
          {t('sidebar.dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('app.totalStudents')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalEstudiantes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('predictions.management.predictions')}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.totalPredicciones}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('predictions.riskLevels.high')}
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {stats.riesgoAlto}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('app.riskDistribution')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('predictions.riskLevels.low')}
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stats.riesgoBajo}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('predictions.riskLevels.medium')}
              </span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {stats.riesgoMedio}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('predictions.riskLevels.high')}
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {stats.riesgoAlto}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('app.quickActions')}
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/predicciones')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {t('predictions.add')}
            </button>
            <button
              onClick={handleGenerateReport}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {t('predictions.viewReports')}
            </button>
            <button
              onClick={handleExportData}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {t('predictions.export')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
