import { Usuario } from './usuario.entity';
import { Inscripcion } from './inscripcion.entity';
import { HabitoEstudio } from './habito-estudio.entity';
import { PrediccionRiesgo } from './prediccion-riesgo.entity';
export declare class Estudiante {
    id_estudiante: string;
    nombres: string;
    apellidos: string;
    email: string;
    semestre_actual: number;
    created_at: Date;
    updated_at: Date;
    usuario: Usuario;
    id_usuario: string;
    inscripciones: Inscripcion[];
    habitos_estudio: HabitoEstudio[];
    predicciones_riesgo: PrediccionRiesgo[];
}
