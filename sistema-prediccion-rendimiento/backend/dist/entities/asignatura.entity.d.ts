import { Inscripcion } from './inscripcion.entity';
export declare class Asignatura {
    id_asignatura: string;
    nombre_asignatura: string;
    creditos: number;
    created_at: Date;
    updated_at: Date;
    inscripciones: Inscripcion[];
}
