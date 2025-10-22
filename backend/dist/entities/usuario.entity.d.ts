import { Estudiante } from './estudiante.entity';
export declare class Usuario {
    id_usuario: string;
    email: string;
    nombres: string;
    apellidos: string;
    nombre_usuario: string;
    rol: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    estudiantes: Estudiante[];
}
