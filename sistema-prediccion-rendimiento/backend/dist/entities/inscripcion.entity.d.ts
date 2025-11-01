import { Estudiante } from './estudiante.entity';
import { Asignatura } from './asignatura.entity';
import { Calificacion } from './calificacion.entity';
import { Asistencia } from './asistencia.entity';
export declare class Inscripcion {
    id_inscripcion: string;
    id_estudiante: string;
    id_asignatura: string;
    periodo_academico: string;
    created_at: Date;
    updated_at: Date;
    estudiante: Estudiante;
    asignatura: Asignatura;
    calificaciones: Calificacion[];
    asistencias: Asistencia[];
}
