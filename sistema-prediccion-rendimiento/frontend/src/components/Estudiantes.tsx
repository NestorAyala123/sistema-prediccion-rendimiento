import React, { useState, useEffect } from 'react';
import { estudiantesService, CreateEstudianteDto } from '../services/api';
import { useTranslation } from '../i18n/useTranslation';

interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  semestre_actual?: number;
  nivel_riesgo?: string;
}

const Estudiantes: React.FC = () => {
  const { t } = useTranslation();
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
    promedio_notas: undefined,
    porcentaje_asistencia: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await estudiantesService.getAll();
      setEstudiantes(data);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Error loading students');
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
      promedio_notas: undefined,
      porcentaje_asistencia: undefined,
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
      promedio_notas: undefined,
      porcentaje_asistencia: undefined,
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'semestre_actual' ||
        name === 'promedio_general' ||
        name === 'promedio_notas' ||
        name === 'porcentaje_asistencia'
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
      setError('Please fill all required fields');
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
      console.error('Full error:', err);
      console.error('Server response:', err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Error creating student'
      );
    } finally {
      setSaving(false);
    }
  };
  const handleVerDetalles = (estudiante: Estudiante) => {
    alert(
      `View details for: ${estudiante.nombres} ${estudiante.apellidos}\n\nThis feature is under development.`
    );
  };

  const handleGenerarPrediccion = (estudiante: Estudiante) => {
    alert(
      `Generating prediction for: ${estudiante.nombres} ${estudiante.apellidos}\n\nThis feature is under development.`
    );
  };

  const handleEliminar = async (estudiante: Estudiante) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${estudiante.nombres} ${estudiante.apellidos}?`
      )
    ) {
      try {
        await estudiantesService.delete(estudiante.id_estudiante);
        await loadEstudiantes();
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Error deleting student');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('studentManagement')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('academicData')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Student List
          </h2>
          <button
            onClick={handleAgregarEstudiante}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('addStudent')}
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder={t('searchStudents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabla para pantallas md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Semestre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nivel de Riesgo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEstudiantes.map((estudiante) => (
                <tr
                  key={estudiante.id_estudiante}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {estudiante.nombres} {estudiante.apellidos}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {estudiante.id_estudiante}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.semestre_actual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                        estudiante.nivel_riesgo || 'No data'
                      )}`}
                    >
                      {estudiante.nivel_riesgo || 'No data'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerDetalles(estudiante)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleGenerarPrediccion(estudiante)}
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                    >
                      Generate Prediction
                    </button>
                    <button
                      onClick={() => handleEliminar(estudiante)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para pantallas xs-sm */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {filteredEstudiantes.map((estudiante) => (
            <div
              key={estudiante.id_estudiante}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {estudiante.nombres} {estudiante.apellidos}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {estudiante.id_estudiante}
                </p>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t('email')}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.email}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Semestre
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {estudiante.semestre_actual}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Nivel de Riesgo
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                        estudiante.nivel_riesgo || 'No data'
                      )}`}
                    >
                      {estudiante.nivel_riesgo || 'No data'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleVerDetalles(estudiante)}
                  className="flex-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 py-2 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleGenerarPrediccion(estudiante)}
                  className="flex-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-2 rounded hover:bg-green-200 dark:hover:bg-green-800"
                >
                  Prediction
                </button>
                <button
                  onClick={() => handleEliminar(estudiante)}
                  className="flex-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-2 rounded hover:bg-red-200 dark:hover:bg-red-800"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar estudiante */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('addStudent')}
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

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    National ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_estudiante"
                    value={formData.id_estudiante}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@university.edu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="semestre_actual"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Semestre Actual <span className="text-red-500">*</span>
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
                    placeholder="Enter current semester (e.g. 1)"
                    title="Student's current semester"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="promedio_notas"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t('averageGrade')}
                  </label>
                  <input
                    id="promedio_notas"
                    type="number"
                    name="promedio_notas"
                    value={formData.promedio_notas || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0-100"
                    title="Average grade percentage (0-100)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="porcentaje_asistencia"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t('attendancePercentage')}
                  </label>
                  <input
                    id="porcentaje_asistencia"
                    type="number"
                    name="porcentaje_asistencia"
                    value={formData.porcentaje_asistencia || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0-100"
                    title="Attendance percentage (0-100)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('loading')}
                    </>
                  ) : (
                    t('save')
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
