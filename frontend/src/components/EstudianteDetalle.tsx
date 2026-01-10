import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { estudiantesService, prediccionesService, calificacionesService, asistenciasService } from '../services/api';

interface Estudiante {
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  promedio_general?: number;
  semestre_actual?: number;
  telefono?: string;
  fecha_ingreso?: Date | string;
  carrera?: string;
  estado?: string;
  activo?: boolean;
  direccion?: string;
  fecha_nacimiento?: Date | string;
}

interface Prediccion {
  id_estudiante: string;
  nivel_riesgo: string;
  probabilidad_riesgo?: number;
  factores_riesgo?: string[];
  recomendaciones?: string[];
  fecha_prediccion?: string;
}

interface Calificacion {
  id_estudiante: string;
  id_asignatura: string;
  nota: number;
  semestre: number;
  nombre_asignatura?: string;
}

interface Asistencia {
  id_estudiante: string;
  id_asignatura: string;
  fecha: string;
  asistio: boolean;
  nombre_asignatura?: string;
}

const EstudianteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [prediccion, setPrediccion] = useState<Prediccion | null>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos del estudiante
      const estudianteData = await estudiantesService.getById(id!);
      setEstudiante(estudianteData);

      // Cargar predicción del estudiante
      const prediccionesData = await prediccionesService.getAll();
      const prediccionEstudiante = prediccionesData.find(
        (p: Prediccion) => p.id_estudiante === estudianteData.id_estudiante
      );
      setPrediccion(prediccionEstudiante || null);

      // Cargar calificaciones
      try {
        const calificacionesData = await calificacionesService.getAll();
        const calificacionesEstudiante = calificacionesData.filter(
          (c: Calificacion) => c.id_estudiante === estudianteData.id_estudiante
        );
        setCalificaciones(calificacionesEstudiante);
      } catch (err) {
        console.error('Error al cargar calificaciones:', err);
      }

      // Cargar asistencias
      try {
        const asistenciasData = await asistenciasService.getAll();
        const asistenciasEstudiante = asistenciasData.filter(
          (a: Asistencia) => a.id_estudiante === estudianteData.id_estudiante
        );
        setAsistencias(asistenciasEstudiante);
      } catch (err) {
        console.error('Error al cargar asistencias:', err);
      }

    } catch (error: any) {
      console.error('Error al cargar datos del estudiante:', error);
      setError('Error al cargar los datos del estudiante');
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    if (!estudiante) return;

    // Crear contenido HTML para el PDF
    const contenidoPDF = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Académico - ${estudiante.nombres} ${estudiante.apellidos}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            padding: 10px;
            background: #f9fafb;
            border-radius: 5px;
          }
          .info-item strong {
            color: #1f2937;
          }
          .riesgo-alto {
            color: #dc2626;
            font-weight: bold;
          }
          .riesgo-medio {
            color: #ca8a04;
            font-weight: bold;
          }
          .riesgo-bajo {
            color: #16a34a;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover {
            background: #f9fafb;
          }
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>REPORTE ACADÉMICO</h1>
          <p>Sistema de Predicción de Rendimiento Académico</p>
        </div>

        <div class="section">
          <h2>Información del Estudiante</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Nombre Completo:</strong><br>
              ${estudiante.nombres} ${estudiante.apellidos}
            </div>
            <div class="info-item">
              <strong>ID Estudiante:</strong><br>
              ${estudiante.id_estudiante}
            </div>
            <div class="info-item">
              <strong>Email:</strong><br>
              ${estudiante.email}
            </div>
            <div class="info-item">
              <strong>Teléfono:</strong><br>
              ${estudiante.telefono || 'No registrado'}
            </div>
            <div class="info-item">
              <strong>Carrera:</strong><br>
              ${estudiante.carrera || 'No especificada'}
            </div>
            <div class="info-item">
              <strong>Semestre Actual:</strong><br>
              ${estudiante.semestre_actual || 'N/A'}
            </div>
            <div class="info-item">
              <strong>Promedio General:</strong><br>
              ${estudiante.promedio_general?.toFixed(2) || 'N/A'}
            </div>
            <div class="info-item">
              <strong>Estado:</strong><br>
              ${estudiante.estado || 'Activo'}
            </div>
          </div>
        </div>

        ${prediccion ? `
        <div class="section">
          <h2>Evaluación de Riesgo Académico</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Nivel de Riesgo:</strong><br>
              <span class="riesgo-${prediccion.nivel_riesgo.toLowerCase()}">${prediccion.nivel_riesgo.toUpperCase()}</span>
            </div>
            <div class="info-item">
              <strong>Probabilidad:</strong><br>
              ${prediccion.probabilidad_riesgo ? (prediccion.probabilidad_riesgo * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
          ${prediccion.factores_riesgo && prediccion.factores_riesgo.length > 0 ? `
          <div>
            <strong>Factores de Riesgo:</strong>
            <ul>
              ${prediccion.factores_riesgo.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          ${prediccion.recomendaciones && prediccion.recomendaciones.length > 0 ? `
          <div>
            <strong>Recomendaciones:</strong>
            <ul>
              ${prediccion.recomendaciones.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${calificaciones.length > 0 ? `
        <div class="section">
          <h2>Historial de Calificaciones</h2>
          <table>
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Nota</th>
                <th>Semestre</th>
              </tr>
            </thead>
            <tbody>
              ${calificaciones.map(c => `
                <tr>
                  <td>${c.nombre_asignatura || c.id_asignatura}</td>
                  <td>${c.nota.toFixed(2)}</td>
                  <td>${c.semestre}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${asistencias.length > 0 ? `
        <div class="section">
          <h2>Registro de Asistencia</h2>
          <p><strong>Total de registros:</strong> ${asistencias.length}</p>
          <p><strong>Asistencias:</strong> ${asistencias.filter(a => a.asistio).length}</p>
          <p><strong>Inasistencias:</strong> ${asistencias.filter(a => !a.asistio).length}</p>
          <p><strong>Porcentaje de asistencia:</strong> ${((asistencias.filter(a => a.asistio).length / asistencias.length) * 100).toFixed(1)}%</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
          <p>Sistema de Predicción de Rendimiento Académico - Universidad</p>
        </div>
      </body>
      </html>
    `;

    // Crear un Blob con el contenido HTML
    const blob = new Blob([contenidoPDF], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace temporal y hacer clic en él
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_${estudiante.nombres}_${estudiante.apellidos}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Abrir en nueva ventana para imprimir como PDF
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenidoPDF);
      ventana.document.close();
      setTimeout(() => {
        ventana.print();
      }, 250);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del estudiante...</p>
        </div>
      </div>
    );
  }

  if (error || !estudiante) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error || 'Estudiante no encontrado'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const porcentajeAsistencia = asistencias.length > 0
    ? (asistencias.filter(a => a.asistio).length / asistencias.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <button
            onClick={generarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Descargar PDF
          </button>
        </div>

        {/* Información del estudiante */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {estudiante.nombres} {estudiante.apellidos}
              </h1>
              <p className="text-gray-600">{estudiante.email}</p>
            </div>
            {prediccion && (
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRiesgoColor(prediccion.nivel_riesgo)}`}>
                Riesgo: {prediccion.nivel_riesgo}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">ID Estudiante</p>
              <p className="text-lg font-semibold text-gray-900">{estudiante.id_estudiante}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Promedio General</p>
              <p className="text-lg font-semibold text-gray-900">
                {estudiante.promedio_general?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Semestre Actual</p>
              <p className="text-lg font-semibold text-gray-900">{estudiante.semestre_actual || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Asistencia</p>
              <p className="text-lg font-semibold text-gray-900">{porcentajeAsistencia.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Predicción de riesgo */}
        {prediccion && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluación de Riesgo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Probabilidad de Riesgo</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        prediccion.nivel_riesgo.toLowerCase() === 'alto' ? 'bg-red-600' :
                        prediccion.nivel_riesgo.toLowerCase() === 'medio' ? 'bg-yellow-500' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${(prediccion.probabilidad_riesgo || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {prediccion.probabilidad_riesgo ? (prediccion.probabilidad_riesgo * 100).toFixed(1) + '%' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {prediccion.factores_riesgo && prediccion.factores_riesgo.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Factores de Riesgo:</p>
                <ul className="list-disc list-inside space-y-1">
                  {prediccion.factores_riesgo.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600">{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {prediccion.recomendaciones && prediccion.recomendaciones.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Recomendaciones:</p>
                <ul className="list-disc list-inside space-y-1">
                  {prediccion.recomendaciones.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Calificaciones */}
        {calificaciones.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Calificaciones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semestre
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calificaciones.map((cal, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cal.nombre_asignatura || cal.id_asignatura}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {cal.nota.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {cal.semestre}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Asistencias */}
        {asistencias.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Registro de Asistencia</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Asistencias</p>
                <p className="text-2xl font-bold text-green-700">
                  {asistencias.filter(a => a.asistio).length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-600">Inasistencias</p>
                <p className="text-2xl font-bold text-red-700">
                  {asistencias.filter(a => !a.asistio).length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Porcentaje</p>
                <p className="text-2xl font-bold text-blue-700">
                  {porcentajeAsistencia.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteDetalle;
