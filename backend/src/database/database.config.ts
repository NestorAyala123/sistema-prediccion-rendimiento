import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Asignatura } from '../entities/asignatura.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Calificacion } from '../entities/calificacion.entity';
import { Asistencia } from '../entities/asistencia.entity';
import { HabitoEstudio } from '../entities/habito-estudio.entity';
import { PrediccionRiesgo } from '../entities/prediccion-riesgo.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/academic_prediction.db',
  entities: [
    Usuario,
    Estudiante,
    Asignatura,
    Inscripcion,
    Calificacion,
    Asistencia,
    HabitoEstudio,
    PrediccionRiesgo,
  ],
  synchronize: true, // Solo para desarrollo - cambiar a false en producción
  logging: true, // Solo para desarrollo
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
};

