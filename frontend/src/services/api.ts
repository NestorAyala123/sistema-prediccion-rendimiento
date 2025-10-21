import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  semestre_actual?: number;
  id_usuario?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateEstudianteDto {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  semestre_actual?: number;
}

export const estudiantesService = {
  async getAll(search?: string): Promise<Estudiante[]> {
    const params = search ? { search } : {};
    const response = await api.get<Estudiante[]>('/estudiantes', { params });
    return response.data;
  },

  async getById(id: string): Promise<Estudiante> {
    const response = await api.get<Estudiante>(`/estudiantes/${id}`);
    return response.data;
  },

  async create(data: CreateEstudianteDto): Promise<Estudiante> {
    const response = await api.post<Estudiante>('/estudiantes', data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreateEstudianteDto>
  ): Promise<Estudiante> {
    const response = await api.put<Estudiante>(`/estudiantes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/estudiantes/${id}`);
  },
};

export default api;
