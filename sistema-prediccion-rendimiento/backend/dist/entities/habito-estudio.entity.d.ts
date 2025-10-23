import { Estudiante } from './estudiante.entity';
export declare class HabitoEstudio {
    id_habito: string;
    id_estudiante: string;
    fecha_encuesta: Date;
    horas_estudio_semanales: number;
    lugar_estudio: string;
    usa_tecnicas_estudio: boolean;
    created_at: Date;
    updated_at: Date;
    estudiante: Estudiante;
}
