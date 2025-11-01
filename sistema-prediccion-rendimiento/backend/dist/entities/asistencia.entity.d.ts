import { Inscripcion } from './inscripcion.entity';
export declare class Asistencia {
    id_asistencia: string;
    id_inscripcion: string;
    fecha_clase: Date;
    estado: string;
    created_at: Date;
    updated_at: Date;
    inscripcion: Inscripcion;
}
