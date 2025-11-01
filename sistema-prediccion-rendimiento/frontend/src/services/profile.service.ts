import { UserProfile, ProfileUpdateData } from '../types/user';
import api from './api';

export const profileService = {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    if (data.fotoFile) {
      const formData = new FormData();
      formData.append('foto', data.fotoFile);
      
      // Primero subimos la foto
      await api.post(`/users/${userId}/profile/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Eliminamos el archivo de los datos a actualizar
      delete data.fotoFile;
    }

    // Actualizamos el resto de los datos del perfil
    const response = await api.patch(`/users/${userId}/profile`, data);
    return response.data;
  },

  async getOwnProfile(): Promise<UserProfile> {
    const response = await api.get('/users/me/profile');
    return response.data;
  },
};