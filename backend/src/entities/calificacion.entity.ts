import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('calificaciones')
export class Calificacion {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_calificacion: string; // UUID

  @Column({ type: 'varchar', length: 36, nullable: false })
  id_inscripcion: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  tipo_evaluacion: string; // 'Parcial 1', 'Deber', 'Examen Final'

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: false })
  nota: number;

  @CreateDateColumn({ type: 'datetime' })
  fecha_registro: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Pertenece a una Inscripción
  @ManyToOne(() => Inscripcion, inscripcion => inscripcion.calificaciones)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;
}
