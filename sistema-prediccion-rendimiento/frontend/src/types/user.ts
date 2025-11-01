export type UserRole = 'estudiante' | 'profesor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: UserRole;
  foto?: string;
  // Campos comunes
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  
  // Campos específicos de profesor
  departamento?: string;
  especialidad?: string;
  gradoAcademico?: string;
  
  // Campos específicos de estudiante
  matricula?: string;
  carrera?: string;
  semestre?: number;
}

export interface ProfileUpdateData extends Partial<Omit<UserProfile, 'id' | 'role'>> {
  fotoFile?: File;
}