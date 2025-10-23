import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('asistencias')
export class Asistencia {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_asistencia: string; // UUID

  @Column({ type: 'varchar', length: 36, nullable: false })
  id_inscripcion: string;

  @Column({ type: 'date', nullable: false })
  fecha_clase: Date;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    nullable: false,
    default: 'Presente'
  })
  estado: string; // 'Presente', 'Ausente', 'Justificado'

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Pertenece a una Inscripción
  @ManyToOne(() => Inscripcion, inscripcion => inscripcion.asistencias)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;
}
