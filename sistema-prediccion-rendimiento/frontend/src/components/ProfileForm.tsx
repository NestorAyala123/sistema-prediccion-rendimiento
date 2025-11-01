import React, { useState, useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { UserProfile, ProfileUpdateData } from '../types/user';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: ProfileUpdateData) => Promise<void>;
  isEditing: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate, isEditing }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProfileUpdateData>({});
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(profile.foto);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fotoFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.nombre')}
          </label>
          <input
            type="text"
            name="nombre"
            defaultValue={profile.nombre}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.apellido')}
          </label>
          <input
            type="text"
            name="apellido"
            defaultValue={profile.apellido}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.email')}
          </label>
          <input
            type="email"
            name="email"
            defaultValue={profile.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.telefono')}
          </label>
          <input
            type="tel"
            name="telefono"
            defaultValue={profile.telefono}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </>
  );

  const renderProfesorFields = () => (
    profile.role === 'profesor' && (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.departamento')}
          </label>
          <input
            type="text"
            name="departamento"
            defaultValue={profile.departamento}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.especialidad')}
          </label>
          <input
            type="text"
            name="especialidad"
            defaultValue={profile.especialidad}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.gradoAcademico')}
          </label>
          <input
            type="text"
            name="gradoAcademico"
            defaultValue={profile.gradoAcademico}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    )
  );

  const renderEstudianteFields = () => (
    profile.role === 'estudiante' && (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.matricula')}
          </label>
          <input
            type="text"
            name="matricula"
            defaultValue={profile.matricula}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.carrera')}
          </label>
          <input
            type="text"
            name="carrera"
            defaultValue={profile.carrera}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('profile.fields.semestre')}
          </label>
          <input
            type="number"
            name="semestre"
            defaultValue={profile.semestre}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    )
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24">
            <img
              className="h-24 w-24 rounded-full object-cover"
              src={fotoPreview || '/placeholder-avatar.png'}
              alt={t('profile.photoAlt')}
            />
            {isEditing && (
              <label
                htmlFor="foto-upload"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center cursor-pointer"
              >
                <span className="sr-only">{t('profile.changePicture')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  id="foto-upload"
                  name="foto"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
              </label>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {profile.nombre} {profile.apellido}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t(`profile.roles.${profile.role}`)}
          </p>
        </div>
      </div>

      {renderCommonFields()}
      {renderProfesorFields()}
      {renderEstudianteFields()}

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('profile.actions.save')}
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;