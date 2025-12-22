import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InscripcionDocument = Inscripcion & Document;

@Schema({ timestamps: true, collection: 'inscripciones' })
export class Inscripcion {
  @Prop({ required: true })
  id_estudiante: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ required: true })
  periodo_academico: string; // Ej: "2025-01"

  @Prop()
  profesor?: string;

  @Prop()
  horario?: string;

  @Prop({ enum: ['inscrito', 'cursando', 'aprobado', 'reprobado', 'retirado'], default: 'inscrito' })
  estado: string;

  @Prop()
  nota_final?: number;

  @Prop({ default: Date.now })
  fecha_inscripcion: Date;
}

export const InscripcionSchema = SchemaFactory.createForClass(Inscripcion);

// Índices
InscripcionSchema.index({ id_estudiante: 1, periodo_academico: -1 });
InscripcionSchema.index({ id_asignatura: 1, periodo_academico: -1 });
InscripcionSchema.index({ periodo_academico: -1 });
InscripcionSchema.index({ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 }, { unique: true });
InscripcionSchema.index({ estado: 1 });
