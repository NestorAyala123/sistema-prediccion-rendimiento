import React, { useState, useEffect } from 'react';
import { estudiantesService, CreateEstudianteDto } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  semestre_actual?: number;
  nivel_riesgo?: string;
}

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  const { t } = useLanguage();

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
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
  };

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
    alert(
      `${t('estudiantes.verDetallesDe')}: ${estudiante.nombres} ${estudiante.apellidos}\n\n${t('estudiantes.enDesarrollo')}`
    );
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
        .includes(searchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.id_estudiante.includes(searchTerm)
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
        <h1 className="text-3xl font-bold text-gray-900">{t('estudiantes.title')}</h1>
        <p className="text-gray-600">{t('estudiantes.subtitle')}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('estudiantes.listaTitulo')}</h2>
          <button
            onClick={handleAgregarEstudiante}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('estudiantes.agregar')}
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={t('estudiantes.buscarPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
              {filteredEstudiantes.map((estudiante) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar estudiante */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('estudiantes.modalTitle')}</h2>
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
  );
};

export default Estudiantes;

