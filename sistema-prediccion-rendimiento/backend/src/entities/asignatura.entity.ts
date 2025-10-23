import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('asignaturas')
export class Asignatura {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id_asignatura: string; // Código de materia

  @Column({ type: 'varchar', length: 200, nullable: false })
  nombre_asignatura: string;

  @Column({ type: 'integer', nullable: true })
  creditos: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Una Asignatura tiene muchas Inscripciones
  @OneToMany(() => Inscripcion, inscripcion => inscripcion.asignatura)
  inscripciones: Inscripcion[];
}
