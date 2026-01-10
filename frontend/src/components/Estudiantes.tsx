import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudiantesService, CreateEstudianteDto, Estudiante as EstudianteAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Estudiante {
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  semestre_actual?: number;
  nivel_riesgo?: string;
  promedio_general?: number;
  telefono?: string;
  carrera?: string;
}

const Estudiantes: React.FC = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm: globalSearchTerm } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateEstudianteDto>({
    id_estudiante: '',
    nombres: '',
    apellidos: '',
    email: '',
    semestre_actual: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  // Sincronizar búsqueda global con búsqueda local
  useEffect(() => {
    if (globalSearchTerm) {
      setLocalSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  // Función para obtener saludo personalizado
  const getPersonalizedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const userName = user?.nombres || user?.email?.split('@')[0] || 'Usuario';
    
    let timeGreeting = '';
    let icon = '';
    
    if (hour >= 6 && hour < 12) {
      timeGreeting = 'Buenos días';
      icon = '🌅';
    } else if (hour >= 12 && hour < 18) {
      timeGreeting = 'Buenas tardes';
      icon = '☀️';
    } else {
      timeGreeting = 'Buenas noches';
      icon = '🌙';
    }
    
    return {
      greeting: `${timeGreeting}, ${userName}`,
      icon,
      userName
    };
  };

  const loadEstudiantes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await estudiantesService.getAll();
      setEstudiantes(data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError(t('estudiantes.errorCargar'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadEstudiantes();
  }, [loadEstudiantes]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N: Nuevo estudiante
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleAgregarEstudiante();
      }
      // Ctrl+F: Enfocar búsqueda
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Ctrl+B: Toggle sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarExpanded(prev => !prev);
      }
      // Escape: Cerrar modal o sidebar móvil
      if (e.key === 'Escape') {
        if (showModal) {
          handleCloseModal();
        } else if (showSidebar) {
          setShowSidebar(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showSidebar]);

  const handleAgregarEstudiante = () => {
    setFormData({
      id_estudiante: '',
      nombres: '',
      apellidos: '',
      email: '',
      semestre_actual: 1,
    });
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id_estudiante: '',
      nombres: '',
      apellidos: '',
      email: '',
      semestre_actual: 1,
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'semestre_actual' || name === 'promedio_general'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.id_estudiante ||
      !formData.nombres ||
      !formData.apellidos ||
      !formData.email
    ) {
      setError(t('estudiantes.completeCampos'));
      return;
    }

    try {
      setSaving(true);
      setError('');

      console.log('Datos a enviar:', formData);
      await estudiantesService.create(formData);
      await loadEstudiantes();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t('estudiantes.errorCrear')
      );
    } finally {
      setSaving(false);
    }
  };
  const handleVerDetalles = (estudiante: Estudiante) => {
    navigate(`/admin/estudiante/${estudiante._id}`);
  };

  const handleGenerarPrediccion = (estudiante: Estudiante) => {
    alert(
      `${t('estudiantes.generandoPara')}: ${estudiante.nombres} ${estudiante.apellidos}\n\n${t('estudiantes.enDesarrollo')}`
    );
  };

  const handleEliminar = async (estudiante: Estudiante) => {
    if (
      window.confirm(
        `${t('estudiantes.confirmEliminar')}: ${estudiante.nombres} ${estudiante.apellidos}?`
      )
    ) {
      try {
        await estudiantesService.delete(estudiante.id_estudiante);
        await loadEstudiantes();
      } catch (err) {
        console.error('Error al eliminar estudiante:', err);
        alert(t('estudiantes.errorEliminar'));
      }
    }
  };

  const filteredEstudiantes = estudiantes.filter(
    (estudiante) =>
      `${estudiante.nombres} ${estudiante.apellidos}`
        .toLowerCase()
        .includes(localSearchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
      estudiante.id_estudiante.includes(localSearchTerm)
  );

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'Alto':
        return 'bg-red-100 text-red-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bajo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Elementos del menú lateral
  const sidebarItems = [
    {
      icon: UserPlusIcon,
      label: t('estudiantes.agregar'),
      action: handleAgregarEstudiante,
      shortcut: 'Ctrl+N',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      icon: MagnifyingGlassIcon,
      label: t('estudiantes.buscar'),
      action: () => searchInputRef.current?.focus(),
      shortcut: 'Ctrl+F',
      color: 'text-gray-600 hover:text-gray-700'
    },
    {
      icon: DocumentTextIcon,
      label: 'Exportar Lista',
      action: () => alert('Función de exportar en desarrollo'),
      shortcut: 'Ctrl+E',
      color: 'text-green-600 hover:text-green-700'
    },
    {
      icon: AcademicCapIcon,
      label: 'Estadísticas',
      action: () => alert('Función de estadísticas en desarrollo'),
      shortcut: 'Ctrl+S',
      color: 'text-purple-600 hover:text-purple-700'
    },
    {
      icon: UserGroupIcon,
      label: 'Gestión Masiva',
      action: () => alert('Función de gestión masiva en desarrollo'),
      shortcut: 'Ctrl+M',
      color: 'text-orange-600 hover:text-orange-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
          aria-hidden="true"
        />
      )}

      {/* Menú lateral expandible */}
      <aside
        className={`bg-white border-r border-gray-200 flex-shrink-0 z-40 transition-all duration-300 ease-in-out ${
          showSidebar ? 'fixed left-0 top-0 h-full transform translate-x-0' : 'hidden md:block'
        } ${sidebarExpanded ? 'w-64' : 'w-16'}`}
        aria-label="Menú de acciones rápidas"
      >
        <div className="h-full flex flex-col">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
              {sidebarExpanded && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Estudiantes</h2>
                  <p className="text-sm text-gray-500">Acciones rápidas</p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={sidebarExpanded ? "Contraer menú" : "Expandir menú"}
            >
              {sidebarExpanded ? (
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Items del menú */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${item.color} hover:bg-gray-50 group`}
                  title={!sidebarExpanded ? `${item.label} (${item.shortcut})` : item.shortcut}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarExpanded && (
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.shortcut}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer del sidebar */}
          {sidebarExpanded && (
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p className="mb-1">Atajos disponibles:</p>
                <p>• Ctrl+N: Nuevo estudiante</p>
                <p>• Ctrl+F: Buscar</p>
                <p>• Ctrl+B: Toggle menú</p>
                <p>• Esc: Cerrar modal</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header del contenido principal - Mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Abrir menú"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {getPersonalizedGreeting().icon} {t('estudiantes.title')}
              </h1>
              <p className="text-xs text-gray-500">{getPersonalizedGreeting().userName}</p>
            </div>
            <div className="w-10"></div> {/* Espaciador */}
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Indicador de idioma activo - Solo para desarrollo */}
            <div className="hidden lg:block mb-2">
              <div className="flex justify-end">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {t('navbar.language')}: {lang.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Bienvenida personalizada */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getPersonalizedGreeting().icon}</span>
                      <h1 className="text-2xl font-bold text-gray-800">
                        {getPersonalizedGreeting().greeting}
                      </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                      {t('estudiantes.subtitle')}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{estudiantes.length} {t('estudiantes.registrados')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{t('dashboard.sistemaActivo')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date().toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p className="mt-1">{new Date().toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas de estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <UserGroupIcon className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('dashboard.totalEstudiantes')}</p>
                    <p className="text-2xl font-bold text-gray-900">{estudiantes.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('estudiantes.activos')}</p>
                    <p className="text-2xl font-bold text-green-600">{estudiantes.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">⚠</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('estudiantes.enRiesgo')}</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {estudiantes.filter(e => e.nivel_riesgo === 'Alto' || e.nivel_riesgo === 'Medio').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <AcademicCapIcon className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('estudiantes.semestrePromedio')}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {estudiantes.length > 0 
                        ? Math.round(estudiantes.reduce((acc, e) => acc + (e.semestre_actual || 0), 0) / estudiantes.length) 
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('estudiantes.listaTitulo')}</h2>
                <button
                  onClick={handleAgregarEstudiante}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  {t('estudiantes.agregar')}
                </button>
              </div>

              {/* Barra de búsqueda mejorada */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t('estudiantes.buscarPlaceholder')}
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                  {localSearchTerm && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        onClick={() => setLocalSearchTerm('')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={t('estudiantes.limpiarBusqueda')}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                {localSearchTerm && (
                  <p className="mt-2 text-sm text-gray-600">
                    {t('estudiantes.resultadosBusqueda').replace('{count}', filteredEstudiantes.length.toString()).replace('{term}', localSearchTerm)}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('estudiantes.colEstudiante')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('estudiantes.colEmail')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('estudiantes.colSemestre')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('estudiantes.colNivelRiesgo')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('estudiantes.colAcciones')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstudiantes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <UserGroupIcon className="w-16 h-16 text-gray-300 mb-4" />
                      {estudiantes.length === 0 ? (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('estudiantes.bienvenidaVacio')} {getPersonalizedGreeting().userName}!
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {t('estudiantes.noEstudiantesRegistrados')}
                          </p>
                          <button
                            onClick={handleAgregarEstudiante}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors gap-2"
                          >
                            <UserPlusIcon className="w-4 h-4" />
                            {t('estudiantes.agregarPrimero')}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t('estudiantes.noResultados')}
                          </h3>
                          <p className="text-gray-500">
                            {t('estudiantes.noCoincidencias').replace('{term}', localSearchTerm)}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEstudiantes.map((estudiante) => (
                <tr key={estudiante.id_estudiante} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {estudiante.nombres} {estudiante.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {estudiante.id_estudiante}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {estudiante.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {estudiante.semestre_actual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                        estudiante.nivel_riesgo || 'Sin datos'
                      )}`}
                    >
                      {estudiante.nivel_riesgo || t('estudiantes.sinDatos')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerDetalles(estudiante)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {t('estudiantes.verDetalles')}
                    </button>
                    <button
                      onClick={() => handleGenerarPrediccion(estudiante)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      {t('estudiantes.generarPrediccion')}
                    </button>
                    <button
                      onClick={() => handleEliminar(estudiante)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('estudiantes.eliminar')}
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar estudiante */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('estudiantes.modalTitle')}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {estudiantes.length === 0 
                    ? t('estudiantes.modalPrimerEstudiante').replace('{userName}', getPersonalizedGreeting().userName)
                    : t('estudiantes.modalAgregarEstudiante').replace('{number}', (estudiantes.length + 1).toString())
                  }
                </p>
              </div>
              <button
                type="button"
                title="Cerrar modal"
                aria-label="Cerrar modal"
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
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

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('estudiantes.labelId')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_estudiante"
                    value={formData.id_estudiante}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('estudiantes.placeholderId')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('estudiantes.labelNombres')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('estudiantes.placeholderNombres')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('estudiantes.labelApellidos')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('estudiantes.placeholderApellidos')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('estudiantes.labelEmail')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('estudiantes.placeholderEmail')}
                  />
                </div>

                <div>
                  <label htmlFor="semestre_actual" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('estudiantes.labelSemestre')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="semestre_actual"
                    type="number"
                    name="semestre_actual"
                    value={formData.semestre_actual}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="10"
                    placeholder={t('estudiantes.placeholderSemestre')}
                    title={t('estudiantes.titleSemestre')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t('estudiantes.cancelar')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('estudiantes.guardando')}
                    </>
                  ) : (
                    t('estudiantes.guardarEstudiante')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estudiantes;

