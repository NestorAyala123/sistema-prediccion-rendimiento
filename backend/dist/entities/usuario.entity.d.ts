import { Estudiante } from './estudiante.entity';
export declare class Usuario {
    id_usuario: string;
    nombre_usuario: string;
    rol: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    estudiantes: Estudiante[];
}
