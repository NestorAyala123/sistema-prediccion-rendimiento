import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Inscripcion } from './inscripcion.entity';
import { HabitoEstudio } from './habito-estudio.entity';
import { PrediccionRiesgo } from './prediccion-riesgo.entity';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id_estudiante: string; // Cédula o ID único

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombres: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  apellidos: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'integer', nullable: true })
  semestre_actual: number;

  @Column({ type: 'real', nullable: true })
  promedio_notas: number;

  @Column({ type: 'real', nullable: true })
  porcentaje_asistencia: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Un Estudiante pertenece a un Usuario (consejero)
  @ManyToOne(() => Usuario, (usuario) => usuario.estudiantes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 36, nullable: true })
  id_usuario: string;

  // Relación: Un Estudiante tiene muchas Inscripciones
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.estudiante)
  inscripciones: Inscripcion[];

  // Relación: Un Estudiante tiene muchos Hábitos de Estudio
  @OneToMany(() => HabitoEstudio, (habito) => habito.estudiante)
  habitos_estudio: HabitoEstudio[];

  // Relación: Un Estudiante tiene muchas Predicciones de Riesgo
  @OneToMany(() => PrediccionRiesgo, (prediccion) => prediccion.estudiante)
  predicciones_riesgo: PrediccionRiesgo[];
}
