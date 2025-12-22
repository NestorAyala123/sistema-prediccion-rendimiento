import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EstudianteDocument = Estudiante & Document;

@Schema({ timestamps: true, collection: 'estudiantes' })
export class Estudiante {
  @Prop({ required: true, unique: true })
  id_estudiante: string; // Cédula o ID único

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop()
  fecha_nacimiento?: Date;

  @Prop({ default: 1 })
  semestre_actual: number;

  @Prop()
  carrera?: string;

  @Prop()
  promedio_general?: number;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  fecha_ingreso?: Date;
}

export const EstudianteSchema = SchemaFactory.createForClass(Estudiante);

// Índices
EstudianteSchema.index({ id_estudiante: 1 });
EstudianteSchema.index({ email: 1 });
EstudianteSchema.index({ apellidos: 1, nombres: 1 });
EstudianteSchema.index({ semestre_actual: 1 });
