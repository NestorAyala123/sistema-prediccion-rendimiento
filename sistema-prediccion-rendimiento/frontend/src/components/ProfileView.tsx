import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { UserProfile } from '../types/user';
import ProfileForm from './ProfileForm';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
  isOwnProfile: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, isOwnProfile }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (data: Partial<UserProfile>) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? t('profile.viewProfile') : `${profile.nombre} ${profile.apellido}`}
            </h2>
            {isOwnProfile && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('profile.actions.edit')}
              </button>
            )}
          </div>
          
          <ProfileForm
            profile={profile}
            onUpdate={handleUpdate}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;