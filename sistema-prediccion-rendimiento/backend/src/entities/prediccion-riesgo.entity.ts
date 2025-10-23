import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity('predicciones_riesgo')
export class PrediccionRiesgo {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_prediccion: string; // UUID

  @Column({ type: 'varchar', length: 20, nullable: false })
  id_estudiante: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha_prediccion: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'Bajo',
  })
  nivel_riesgo: string; // 'Bajo', 'Medio', 'Alto'

  @Column({ type: 'text', nullable: false })
  factores_clave: string; // Ej: "Bajas notas en Cálculo, 30% de inasistencia"

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'Calculando',
  })
  estado_prediccion: string; // 'Calculando', 'Completado'

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Pertenece a un Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.predicciones_riesgo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
