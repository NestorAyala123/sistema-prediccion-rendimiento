import axios from 'axios';

// Por defecto apuntar al backend en el puerto 4000 (ajustable con REACT_APP_API_URL)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
  _id: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
  semestre_actual?: number;
  carrera?: string;
  promedio_general?: number;
  activo?: boolean;
  fecha_ingreso?: Date;
  id_usuario?: string;
  createdAt?: Date;
  updatedAt?: Date;
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

  async updateProfile(data: Partial<RegisterRequest>): Promise<{ user: any }> {
    const response = await api.patch('/auth/profile', data);
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

  async generate(id_estudiante: string, data?: any): Promise<any> {
    const response = await api.post('/predicciones/generar', {
      id_estudiante,
      data,
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

// Servicio de Asignaturas
export const asignaturasService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/asignaturas');
    return response.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/asignaturas/${id}`);
    return response.data;
  },

  async create(data: { id_asignatura: string; nombre_asignatura: string; creditos?: number }): Promise<any> {
    const response = await api.post('/asignaturas', data);
    return response.data;
  },

  async update(id: string, data: Partial<{ nombre_asignatura: string; creditos: number }>): Promise<any> {
    const response = await api.put(`/asignaturas/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/asignaturas/${id}`);
  },
};

// Servicio de Calificaciones
export const calificacionesService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/calificaciones');
    return response.data;
  },

  async getByEstudiante(id_estudiante: string): Promise<any[]> {
    const response = await api.get(`/calificaciones/estudiante/${id_estudiante}`);
    return response.data;
  },

  async getByPeriodo(periodo: string): Promise<any[]> {
    const response = await api.get(`/calificaciones/periodo/${periodo}`);
    return response.data;
  },

  async getByAsignaturaYPeriodo(id_asignatura: string, periodo: string): Promise<any[]> {
    const response = await api.get(`/calificaciones/asignatura/${id_asignatura}/periodo/${periodo}`);
    return response.data;
  },

  async create(data: {
    id_inscripcion: string;
    tipo_evaluacion: string;
    nota: number;
  }): Promise<any> {
    const response = await api.post('/calificaciones', data);
    return response.data;
  },

  async createPorPeriodo(data: {
    id_estudiante: string;
    id_asignatura: string;
    periodo_academico: string;
    tipo_evaluacion: string;
    nota: number;
  }): Promise<any> {
    const response = await api.post('/calificaciones/por-periodo', data);
    return response.data;
  },

  async update(id: string, data: Partial<{ nota: number; tipo_evaluacion: string }>): Promise<any> {
    const response = await api.put(`/calificaciones/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/calificaciones/${id}`);
  },

  async getPromedioEstudiantePeriodo(id_estudiante: string, periodo: string): Promise<{ promedio: number }> {
    const response = await api.get(`/calificaciones/promedio/estudiante/${id_estudiante}/periodo/${periodo}`);
    return response.data;
  },
};

// Servicio de Asistencias
export const asistenciasService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/asistencias');
    return response.data;
  },

  async getByEstudiante(id_estudiante: string): Promise<any[]> {
    const response = await api.get(`/asistencias/estudiante/${id_estudiante}`);
    return response.data;
  },

  async getByFecha(fecha: string): Promise<any[]> {
    const response = await api.get(`/asistencias/fecha/${fecha}`);
    return response.data;
  },

  async createLote(data: {
    id_asignatura: string;
    fecha_clase: string;
    periodo_academico: string;
    asistencias: Array<{ id_estudiante: string; estado: string }>;
  }): Promise<any> {
    const response = await api.post('/asistencias/lote', data);
    return response.data;
  },
};

export default api;
