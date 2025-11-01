import { Inscripcion } from './inscripcion.entity';
export declare class Calificacion {
    id_calificacion: string;
    id_inscripcion: string;
    tipo_evaluacion: string;
    nota: number;
    fecha_registro: Date;
    created_at: Date;
    updated_at: Date;
    inscripcion: Inscripcion;
}
