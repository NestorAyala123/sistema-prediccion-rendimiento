import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Asignatura } from './asignatura.entity';
import { Calificacion } from './calificacion.entity';
import { Asistencia } from './asistencia.entity';

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_inscripcion: string; // UUID

  @Column({ type: 'varchar', length: 20, nullable: false })
  id_estudiante: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  id_asignatura: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  periodo_academico: string; // Ej: "2025-01"

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Pertenece a un Estudiante
  @ManyToOne(() => Estudiante, estudiante => estudiante.inscripciones)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  // Relación: Pertenece a una Asignatura
  @ManyToOne(() => Asignatura, asignatura => asignatura.inscripciones)
  @JoinColumn({ name: 'id_asignatura' })
  asignatura: Asignatura;

  // Relación: Tiene muchas Calificaciones
  @OneToMany(() => Calificacion, calificacion => calificacion.inscripcion)
  calificaciones: Calificacion[];

  // Relación: Tiene muchas Asistencias
  @OneToMany(() => Asistencia, asistencia => asistencia.inscripcion)
  asistencias: Asistencia[];
}
