import React, { useState, useEffect } from 'react';
import { prediccionesService, estudiantesService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearch } from '../contexts/SearchContext';
import { 
  UserPlusIcon, 
  XMarkIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import { 
  predecirRendimiento, 
  EstudianteAIInput, 
  PrediccionAIOutput,
  getRiesgoColor,
  getRiesgoLabel,
  formatearProbabilidad
} from '../services/aiService';

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
  semestre_actual?: number;
}

interface NuevaPrediccion {
  id_estudiante: string;
  notas_promedio: number;
  asistencia_porcentaje: number;
  horas_estudio_semana: number;
  participacion_clase: string;
  entregas_tareas_porcentaje: number;
  notas_examenes_promedio: number;
}

const Predicciones: React.FC = () => {
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState('todos');
  const { searchTerm: globalSearchTerm } = useSearch();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<NuevaPrediccion>({
    id_estudiante: '',
    notas_promedio: 0,
    asistencia_porcentaje: 0,
    horas_estudio_semana: 0,
    participacion_clase: 'media',
    entregas_tareas_porcentaje: 0,
    notas_examenes_promedio: 0,
  });
  const { t } = useLanguage();
  
  // Estados para predicción con IA
  const [prediccionIA, setPrediccionIA] = useState<PrediccionAIOutput | null>(null);
  const [loadingIA, setLoadingIA] = useState(false);

  useEffect(() => {
    loadPredicciones();
    loadEstudiantes();

    // Polling: Actualizar predicciones cada 30 segundos para mantener sincronizado
    const intervalId = setInterval(() => {
      loadPredicciones(true); // Modo silencioso para no mostrar spinner
    }, 30000); // 30 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  // useEffect para predicción automática con IA
  useEffect(() => {
    const generarPrediccionAutomatica = async () => {
      // Solo generar si hay datos completos y válidos
      if (
        formData.id_estudiante && 
        formData.notas_promedio > 0 &&
        formData.asistencia_porcentaje > 0 &&
        !loadingIA
      ) {
        const estudianteSeleccionado = estudiantes.find(e => e.id_estudiante === formData.id_estudiante);
        
        if (estudianteSeleccionado) {
          try {
            const estudianteInput: EstudianteAIInput = {
              id_estudiante: formData.id_estudiante,
              nombres: estudianteSeleccionado.nombres,
              apellidos: estudianteSeleccionado.apellidos,
              semestre_actual: estudianteSeleccionado.semestre_actual || 1,
              notas_promedio: formData.notas_promedio,
              notas_examenes_promedio: formData.notas_examenes_promedio,
              entregas_tareas_porcentaje: formData.entregas_tareas_porcentaje,
              asistencia_porcentaje: formData.asistencia_porcentaje,
              horas_estudio_semana: formData.horas_estudio_semana,
              participacion_clase: formData.participacion_clase as 'baja' | 'media' | 'alta',
              usa_tecnicas_estudio: formData.horas_estudio_semana >= 10,
            };

            const prediccion = await predecirRendimiento(estudianteInput);
            setPrediccionIA(prediccion);
            console.log('🤖 Predicción automática generada:', prediccion);
            
          } catch (error) {
            console.log('ℹ️ Servicio de IA no disponible (modo silencioso)');
            setPrediccionIA(null);
          }
        }
      }
    };

    // Ejecutar con un pequeño delay para evitar llamadas excesivas
    const timer = setTimeout(generarPrediccionAutomatica, 1000);
    return () => clearTimeout(timer);
  }, [formData, estudiantes, loadingIA]);

  const loadPredicciones = async (silentMode = false) => {
    try {
      if (!silentMode) {
        setLoading(true);
      } else {
        setSyncing(true);
      }
      const data = await prediccionesService.getAll();
      setPredicciones(data);
    } catch (err) {
      console.error('Error al cargar predicciones:', err);
      if (!silentMode) {
        setError('Error al cargar las predicciones');
      }
    } finally {
      if (!silentMode) {
        setLoading(false);
      } else {
        setSyncing(false);
      }
    }
  };

  const loadEstudiantes = async () => {
    try {
      const data = await estudiantesService.getAll();
      setEstudiantes(data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      // Datos de ejemplo si falla la API
      setEstudiantes([
        { id_estudiante: '1234567890', nombres: 'Juan', apellidos: 'Pérez', email: 'juan@example.com', semestre_actual: 3 },
        { id_estudiante: '0987654321', nombres: 'Ana', apellidos: 'García', email: 'ana@example.com', semestre_actual: 2 },
      ]);
    }
  };

  const handleGenerarNuevas = () => {
    setFormData({
      id_estudiante: '',
      notas_promedio: 0,
      asistencia_porcentaje: 0,
      horas_estudio_semana: 0,
      participacion_clase: 'media',
      entregas_tareas_porcentaje: 0,
      notas_examenes_promedio: 0,
    });
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id_estudiante: '',
      notas_promedio: 0,
      asistencia_porcentaje: 0,
      horas_estudio_semana: 0,
      participacion_clase: 'media',
      entregas_tareas_porcentaje: 0,
      notas_examenes_promedio: 0,
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['notas_promedio', 'asistencia_porcentaje', 'horas_estudio_semana', 'entregas_tareas_porcentaje', 'notas_examenes_promedio'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const calcularNivelRiesgo = (data: NuevaPrediccion): string => {
    let puntajeRiesgo = 0;

    // Evaluación de notas (peso: 30%)
    if (data.notas_promedio < 5) puntajeRiesgo += 30;
    else if (data.notas_promedio < 7) puntajeRiesgo += 15;
    else if (data.notas_promedio < 8) puntajeRiesgo += 5;

    // Evaluación de asistencia (peso: 25%)
    if (data.asistencia_porcentaje < 70) puntajeRiesgo += 25;
    else if (data.asistencia_porcentaje < 80) puntajeRiesgo += 15;
    else if (data.asistencia_porcentaje < 90) puntajeRiesgo += 5;

    // Evaluación de horas de estudio (peso: 20%)
    if (data.horas_estudio_semana < 5) puntajeRiesgo += 20;
    else if (data.horas_estudio_semana < 10) puntajeRiesgo += 10;
    else if (data.horas_estudio_semana < 15) puntajeRiesgo += 5;

    // Evaluación de entregas (peso: 15%)
    if (data.entregas_tareas_porcentaje < 60) puntajeRiesgo += 15;
    else if (data.entregas_tareas_porcentaje < 80) puntajeRiesgo += 10;
    else if (data.entregas_tareas_porcentaje < 90) puntajeRiesgo += 5;

    // Evaluación de exámenes (peso: 10%)
    if (data.notas_examenes_promedio < 5) puntajeRiesgo += 10;
    else if (data.notas_examenes_promedio < 7) puntajeRiesgo += 5;

    if (puntajeRiesgo >= 60) return 'Alto';
    if (puntajeRiesgo >= 30) return 'Medio';
    return 'Bajo';
  };

  const generarFactoresClave = (data: NuevaPrediccion): string => {
    const factores = [];
    
    if (data.notas_promedio < 6) {
      factores.push(`Promedio bajo (${data.notas_promedio}/10)`);
    }
    if (data.asistencia_porcentaje < 80) {
      factores.push(`Asistencia insuficiente (${data.asistencia_porcentaje}%)`);
    }
    if (data.horas_estudio_semana < 10) {
      factores.push(`Pocas horas de estudio (${data.horas_estudio_semana}h/semana)`);
    }
    if (data.entregas_tareas_porcentaje < 80) {
      factores.push(`Bajo porcentaje de entregas (${data.entregas_tareas_porcentaje}%)`);
    }
    if (data.participacion_clase === 'baja') {
      factores.push('Participación en clase baja');
    }
    
    if (factores.length === 0) {
      factores.push(`Buen rendimiento general`);
      factores.push(`Promedio: ${data.notas_promedio}/10`);
      factores.push(`Asistencia: ${data.asistencia_porcentaje}%`);
    }
    
    return factores.join(', ');
  };

  // Función para generar predicción con IA
  const handleGenerarPrediccionIA = async () => {
    if (!formData.id_estudiante) {
      alert('⚠️ Por favor selecciona un estudiante primero');
      return;
    }

    setLoadingIA(true);
    try {
      const estudianteSeleccionado = estudiantes.find(e => e.id_estudiante === formData.id_estudiante);
      
      // Construir el input para la IA
      const estudianteInput: EstudianteAIInput = {
        id_estudiante: formData.id_estudiante,
        nombres: estudianteSeleccionado?.nombres || '',
        apellidos: estudianteSeleccionado?.apellidos || '',
        semestre_actual: estudianteSeleccionado?.semestre_actual || 1,
        notas_promedio: formData.notas_promedio,
        notas_examenes_promedio: formData.notas_examenes_promedio,
        entregas_tareas_porcentaje: formData.entregas_tareas_porcentaje,
        asistencia_porcentaje: formData.asistencia_porcentaje,
        horas_estudio_semana: formData.horas_estudio_semana,
        participacion_clase: formData.participacion_clase as 'baja' | 'media' | 'alta',
        usa_tecnicas_estudio: formData.horas_estudio_semana >= 10,
      };

      // Llamar a la API de Python
      const resultado = await predecirRendimiento(estudianteInput);
      
      setPrediccionIA(resultado);
      
      // Mostrar notificación de éxito
      console.log('✅ Predicción IA generada:', resultado);
      
    } catch (error: any) {
      console.error('Error al generar predicción IA:', error);
      alert(
        '❌ Error al conectar con el servicio de IA.\n\n' +
        'Asegúrate de que predictor_api.py esté ejecutándose:\n' +
        'python predictor_api.py\n\n' +
        'URL esperada: http://localhost:8000'
      );
      setPrediccionIA(null);
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_estudiante) {
      setError(t('predicciones.seleccioneEstudiante'));
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Generar predicción con IA
      await handleGenerarPrediccionIA();

      // Calcular nivel de riesgo y factores clave
      const nivelRiesgo = calcularNivelRiesgo(formData);
      const factoresClave = generarFactoresClave(formData);

      // Obtener datos del estudiante seleccionado
      const estudiante = estudiantes.find(e => e.id_estudiante === formData.id_estudiante);

      // Crear la predicción en el backend
      const nuevaPrediccion = await prediccionesService.generate(formData.id_estudiante, {
        nivel_riesgo: nivelRiesgo,
        factores_clave: factoresClave,
        ...formData,
      });

      // Actualizar el estado local inmediatamente (tiempo real)
      const prediccionParaMostrar: Prediccion = {
        id_prediccion: nuevaPrediccion.id_prediccion,
        id_estudiante: nuevaPrediccion.id_estudiante,
        nombres: estudiante?.nombres || '',
        apellidos: estudiante?.apellidos || '',
        fecha_prediccion: new Date().toISOString().split('T')[0],
        nivel_riesgo: nuevaPrediccion.nivel_riesgo,
        factores_clave: nuevaPrediccion.factores_clave,
        estado_prediccion: nuevaPrediccion.estado_prediccion || 'Completado',
      };

      // Agregar al principio de la lista para mostrarlo inmediatamente
      setPredicciones((prev) => [prediccionParaMostrar, ...prev]);
      
      handleCloseModal();

      // Mostrar mensaje de éxito
      alert(t('predicciones.prediccionCreada'));
    } catch (err: any) {
      console.error('Error completo:', err);
      
      // Mostrar mensaje de error más descriptivo
      let errorMsg = t('predicciones.errorCrear');
      if (err.response) {
        errorMsg += `\n\nDetalles: ${err.response.data.message || err.response.statusText}`;
      } else if (err.request) {
        errorMsg += '\n\nNo se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:4000';
      } else {
        errorMsg += `\n\n${err.message}`;
      }
      
      setError(errorMsg);
    } finally {
      setSaving(false);
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

  const handleRecalcular = async (prediccion: Prediccion) => {
    if (
      window.confirm(
        `${t('predicciones.confirmRecalcular')}: ${prediccion.nombres} ${prediccion.apellidos}?`
      )
    ) {
      try {
        // Crear nueva predicción (recalcular)
        const nuevaPrediccion = await prediccionesService.generate(prediccion.id_estudiante);

        // Actualizar en tiempo real: reemplazar la predicción antigua con la nueva
        setPredicciones((prev) =>
          prev.map((p) =>
            p.id_prediccion === prediccion.id_prediccion
              ? {
                  ...p,
                  id_prediccion: nuevaPrediccion.id_prediccion,
                  nivel_riesgo: nuevaPrediccion.nivel_riesgo,
                  factores_clave: nuevaPrediccion.factores_clave,
                  fecha_prediccion: new Date().toISOString().split('T')[0],
                  estado_prediccion: nuevaPrediccion.estado_prediccion || 'Completado',
                }
              : p
          )
        );

        alert('Predicción recalculada exitosamente');
      } catch (err) {
        console.error('Error al recalcular:', err);
        alert('Error al recalcular la predicción');
      }
    }
  };

  // Filtrar predicciones basándose en el filtro seleccionado y en la búsqueda global
  const filteredPredicciones = predicciones.filter((prediccion) => {
    const matchesFilter = filter === 'todos' || prediccion.nivel_riesgo === filter;
    const matchesSearch = !globalSearchTerm || 
      `${prediccion.nombres} ${prediccion.apellidos}`.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      prediccion.id_estudiante.includes(globalSearchTerm) ||
      prediccion.nivel_riesgo.toLowerCase().includes(globalSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{t('predicciones.generadasTitulo')}</h2>
            {syncing && (
              <div className="flex items-center text-sm text-blue-600">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sincronizando...
              </div>
            )}
          </div>
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

      {/* Modal para nueva predicción */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <UserPlusIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('predicciones.nuevaPrediccion')}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Selector de Estudiante */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AcademicCapIcon className="w-4 h-4 inline mr-1" />
                  {t('predicciones.seleccionarEstudiante')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="id_estudiante"
                  value={formData.id_estudiante}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('predicciones.seleccioneOpcion')}</option>
                  {estudiantes.map((estudiante) => (
                    <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}>
                      {estudiante.nombres} {estudiante.apellidos} ({estudiante.id_estudiante})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid de Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notas Promedio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ChartBarIcon className="w-4 h-4 inline mr-1" />
                    {t('predicciones.notasPromedio')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="notas_promedio"
                    value={formData.notas_promedio}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0 - 10.0"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('predicciones.rangoNotasPromedio')}</p>
                </div>

                {/* Asistencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                    {t('predicciones.asistencia')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="asistencia_porcentaje"
                    value={formData.asistencia_porcentaje}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 - 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('predicciones.rangoAsistencia')}</p>
                </div>

                {/* Horas de Estudio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('predicciones.horasEstudio')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="horas_estudio_semana"
                    value={formData.horas_estudio_semana}
                    onChange={handleInputChange}
                    min="0"
                    max="168"
                    step="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 - 168"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('predicciones.rangoHorasEstudio')}</p>
                </div>

                {/* Participación en Clase */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('predicciones.participacion')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="participacion_clase"
                    value={formData.participacion_clase}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="baja">{t('predicciones.participacionBaja')}</option>
                    <option value="media">{t('predicciones.participacionMedia')}</option>
                    <option value="alta">{t('predicciones.participacionAlta')}</option>
                  </select>
                </div>

                {/* Entregas de Tareas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('predicciones.entregas')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="entregas_tareas_porcentaje"
                    value={formData.entregas_tareas_porcentaje}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 - 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('predicciones.rangoEntregas')}</p>
                </div>

                {/* Notas de Exámenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('predicciones.examenes')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="notas_examenes_promedio"
                    value={formData.notas_examenes_promedio}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0 - 10.0"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('predicciones.rangoExamenes')}</p>
                </div>
              </div>

              {/* Predicción con IA */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">🤖 Análisis con Inteligencia Artificial</h4>
                  <button
                    type="button"
                    onClick={handleGenerarPrediccionIA}
                    disabled={loadingIA || !formData.id_estudiante}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingIA ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analizando...
                      </>
                    ) : (
                      '🧠 Analizar con IA'
                    )}
                  </button>
                </div>

                {prediccionIA && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="space-y-4">
                      {/* Nivel de Riesgo */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span 
                            className="px-4 py-2 rounded-full text-white font-bold text-sm shadow-md"
                            style={{ backgroundColor: getRiesgoColor(prediccionIA.riesgo) }}
                          >
                            {getRiesgoLabel(prediccionIA.riesgo)}
                          </span>
                          <div className="text-sm">
                            <span className="text-gray-600">Probabilidad: </span>
                            <span className="font-bold text-gray-900">{formatearProbabilidad(prediccionIA.probabilidad)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Puntuación: </span>
                            <span className="font-bold text-gray-900">{prediccionIA.puntuacion.toFixed(1)}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Factores Críticos */}
                      <div>
                        <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-red-500">⚠️</span>
                          Factores Críticos:
                        </p>
                        <ul className="space-y-1">
                          {prediccionIA.factores_criticos.map((factor, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recomendaciones */}
                      <div>
                        <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-green-500">💡</span>
                          Recomendaciones:
                        </p>
                        <ul className="space-y-1">
                          {prediccionIA.recomendaciones.map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Metadata */}
                      <div className="pt-2 border-t border-purple-200 flex justify-between text-xs text-gray-500">
                        <span>Modelo v{prediccionIA.modelo_version}</span>
                        <span>{new Date(prediccionIA.fecha_prediccion).toLocaleString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!prediccionIA && !loadingIA && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                      💡 Completa los datos del estudiante y haz clic en "Analizar con IA" para obtener una predicción basada en inteligencia artificial.
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {t('common.cancelar')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('common.guardando')}
                    </>
                  ) : (
                    t('common.guardar')
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
