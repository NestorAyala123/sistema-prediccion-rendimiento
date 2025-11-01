import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id_usuario: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombres: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  apellidos: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'usuario' })
  rol: string; // 'admin', 'consejero', 'profesor', 'usuario'

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relación: Un Usuario (consejero) monitorea a muchos Estudiantes
  @OneToMany(() => Estudiante, (estudiante) => estudiante.usuario)
  estudiantes: Estudiante[];
}
