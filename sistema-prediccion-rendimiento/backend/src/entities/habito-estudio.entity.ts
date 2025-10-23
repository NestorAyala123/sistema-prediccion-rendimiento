import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity('habitos_estudio')
export class HabitoEstudio {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_habito: string; // UUID

  @Column({ type: 'varchar', length: 20, nullable: false })
  id_estudiante: string;

  @Column({ type: 'date', nullable: false })
  fecha_encuesta: Date;

  @Column({ type: 'integer', nullable: false })
  horas_estudio_semanales: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lugar_estudio: string; // 'Biblioteca', 'Casa', 'Grupo'

  @Column({ type: 'boolean', default: false })
  usa_tecnicas_estudio: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Pertenece a un Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.habitos_estudio, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
