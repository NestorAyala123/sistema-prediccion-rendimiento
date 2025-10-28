import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('soporte')
export class Soporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  asunto: string;

  @Column({ length: 255 })
  correo: string;

  @Column('text')
  mensaje: string;

  @Column({ length: 50, default: 'abierto' })
  estado: string;

  @CreateDateColumn()
  created_at: Date;
}
