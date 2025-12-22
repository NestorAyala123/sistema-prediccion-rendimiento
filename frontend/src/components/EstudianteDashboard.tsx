import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
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

const EstudianteDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);

  useEffect(() => {
    // Simulación de datos - aquí conectarás con tu API
    setCalificaciones([
      { materia: 'Matemáticas', nota: 85, semestre: 1 },
      { materia: 'Física', nota: 78, semestre: 1 },
      { materia: 'Programación', nota: 92, semestre: 1 },
      { materia: 'Base de Datos', nota: 88, semestre: 1 },
    ]);

    setAsistencias([
      { materia: 'Matemáticas', porcentaje: 95 },
      { materia: 'Física', porcentaje: 87 },
      { materia: 'Programación', porcentaje: 98 },
      { materia: 'Base de Datos', porcentaje: 92 },
    ]);

    // Calcular promedio
    const promedio = calificaciones.reduce((acc, cal) => acc + cal.nota, 0) / calificaciones.length || 0;
    setPromedioGeneral(Math.round(promedio));
  }, []);

  const getNivelRiesgo = (promedio: number) => {
    if (promedio >= 80) return { nivel: t('estudiante.riesgoBajo'), color: 'text-green-600', bg: 'bg-green-100' };
    if (promedio >= 60) return { nivel: t('estudiante.riesgoMedio'), color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { nivel: t('estudiante.riesgoAlto'), color: 'text-red-600', bg: 'bg-red-100' };
  };

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
