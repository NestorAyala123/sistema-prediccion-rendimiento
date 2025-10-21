import { Estudiante } from './estudiante.entity';
export declare class PrediccionRiesgo {
    id_prediccion: string;
    id_estudiante: string;
    fecha_prediccion: Date;
    nivel_riesgo: string;
    factores_clave: string;
    estado_prediccion: string;
    created_at: Date;
    updated_at: Date;
    estudiante: Estudiante;
}
