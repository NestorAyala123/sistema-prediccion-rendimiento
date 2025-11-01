import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import type { UserProfile } from '../types/user';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getOwnProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar el perfil'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    try {
      setIsLoading(true);
      setError(null);
      const updatedProfile = await profileService.updateProfile(profile.id, data);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al actualizar el perfil'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};