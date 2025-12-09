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
    try {
      const params = search ? { search } : {};
      const response = await api.get<Estudiante[]>('/estudiantes', { params });
      return response.data;
    } catch (error) {
      // Si falla la conexión al backend, usar datos simulados
      console.warn('Backend no disponible, usando datos de ejemplo');
      const mockData: Estudiante[] = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      if (search) {
        return mockData.filter(e => 
          e.nombres.toLowerCase().includes(search.toLowerCase()) ||
          e.apellidos.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase()) ||
          e.id_estudiante.includes(search)
        );
      }
      return mockData;
    }
  },

  async getById(id: string): Promise<Estudiante> {
    try {
      const response = await api.get<Estudiante>(`/estudiantes/${id}`);
      return response.data;
    } catch (error) {
      const mockData: Estudiante[] = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      const estudiante = mockData.find(e => e.id_estudiante === id);
      if (!estudiante) throw new Error('Estudiante no encontrado');
      return estudiante;
    }
  },

  async create(data: CreateEstudianteDto): Promise<Estudiante> {
    try {
      const response = await api.post<Estudiante>('/estudiantes', data);
      return response.data;
    } catch (error) {
      // Usar almacenamiento local si el backend no está disponible
      console.warn('Backend no disponible, guardando en localStorage');
      const mockData: Estudiante[] = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      
      // Verificar si el estudiante ya existe
      if (mockData.some(e => e.id_estudiante === data.id_estudiante)) {
        throw new Error('Ya existe un estudiante con este ID');
      }
      
      const nuevoEstudiante: Estudiante = {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      mockData.push(nuevoEstudiante);
      localStorage.setItem('estudiantes', JSON.stringify(mockData));
      return nuevoEstudiante;
    }
  },

  async update(
    id: string,
    data: Partial<CreateEstudianteDto>
  ): Promise<Estudiante> {
    try {
      const response = await api.put<Estudiante>(`/estudiantes/${id}`, data);
      return response.data;
    } catch (error) {
      const mockData: Estudiante[] = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      const index = mockData.findIndex(e => e.id_estudiante === id);
      if (index === -1) throw new Error('Estudiante no encontrado');
      
      mockData[index] = { ...mockData[index], ...data, updated_at: new Date() };
      localStorage.setItem('estudiantes', JSON.stringify(mockData));
      return mockData[index];
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/estudiantes/${id}`);
    } catch (error) {
      const mockData: Estudiante[] = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      const filtered = mockData.filter(e => e.id_estudiante !== id);
      localStorage.setItem('estudiantes', JSON.stringify(filtered));
    }
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
