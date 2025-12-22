import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AsistenciaDocument = Asistencia & Document;

@Schema({ timestamps: true, collection: 'asistencias' })
export class Asistencia {
  @Prop({ required: true })
  id_estudiante: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ required: true })
  periodo_academico: string;

  @Prop({ required: true })
  fecha_clase: Date;

  @Prop({ required: true, enum: ['Presente', 'Ausente', 'Justificado', 'Tardanza'], default: 'Presente' })
  estado: string;

  @Prop()
  justificacion?: string;

  @Prop()
  observaciones?: string;

  @Prop()
  registrado_por?: string; // ID del profesor que registró
}

export const AsistenciaSchema = SchemaFactory.createForClass(Asistencia);

// Índices
AsistenciaSchema.index({ id_estudiante: 1, periodo_academico: -1 });
AsistenciaSchema.index({ id_asignatura: 1, periodo_academico: -1 });
AsistenciaSchema.index({ id_estudiante: 1, id_asignatura: 1, periodo_academico: 1 });
AsistenciaSchema.index({ fecha_clase: -1 });
AsistenciaSchema.index({ estado: 1 });
AsistenciaSchema.index({ id_estudiante: 1, id_asignatura: 1, fecha_clase: 1 }, { unique: true });
