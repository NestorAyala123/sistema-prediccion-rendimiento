import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CalificacionDocument = Calificacion & Document;

@Schema({ timestamps: true, collection: 'calificaciones' })
export class Calificacion {
  @Prop({ required: true })
  id_estudiante: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ required: true })
  periodo_academico: string;

  @Prop({ required: true })
  tipo_evaluacion: string; // 'Parcial 1', 'Parcial 2', 'Deber', 'Examen Final', 'Proyecto', etc.

  @Prop({ required: true, min: 0, max: 10 })
  nota: number;

  @Prop()
  porcentaje?: number; // Peso de la evaluación (0-100)

  @Prop()
  observaciones?: string;

  @Prop({ default: Date.now })
  fecha_registro: Date;

  @Prop()
  fecha_evaluacion?: Date;

  @Prop()
  registrado_por?: string; // ID del profesor que registró
}

export const CalificacionSchema = SchemaFactory.createForClass(Calificacion);

// Índices
CalificacionSchema.index({ id_estudiante: 1, periodo_academico: -1 });
CalificacionSchema.index({ id_asignatura: 1, periodo_academico: -1 });
CalificacionSchema.index({ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 });
CalificacionSchema.index({ tipo_evaluacion: 1 });
CalificacionSchema.index({ fecha_registro: -1 });
