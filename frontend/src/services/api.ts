import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    nombres: string;
    apellidos: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
}

// Servicio de Autenticación
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Servicio de Estudiantes
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

  async exportCSV(): Promise<Blob> {
    const response = await api.get('/estudiantes/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Servicio de Predicciones
export const prediccionesService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/predicciones');
    return response.data;
  },

  async getByEstudiante(id_estudiante: string): Promise<any[]> {
    const response = await api.get(`/predicciones/estudiante/${id_estudiante}`);
    return response.data;
  },

  async generate(id_estudiante: string): Promise<any> {
    const response = await api.post('/predicciones/generar', {
      id_estudiante,
    });
    return response.data;
  },

  async getReport(id_prediccion: string): Promise<Blob> {
    const response = await api.get(`/predicciones/${id_prediccion}/reporte`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
