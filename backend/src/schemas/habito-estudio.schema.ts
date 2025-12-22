import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HabitoEstudioDocument = HabitoEstudio & Document;

@Schema({ timestamps: true, collection: 'habitos_estudio' })
export class HabitoEstudio {
  @Prop({ required: true })
  id_estudiante: string;

  @Prop({ required: true, default: Date.now })
  fecha_encuesta: Date;

  @Prop({ required: true, min: 0 })
  horas_estudio_semanales: number;

  @Prop({ enum: ['Biblioteca', 'Casa', 'Grupo', 'Cafetería', 'Otro'] })
  lugar_estudio?: string;

  @Prop({ default: false })
  usa_tecnicas_estudio: boolean;

  @Prop()
  tecnicas_utilizadas?: string[]; // Array de técnicas: 'Resumen', 'Mapas mentales', etc.

  @Prop()
  horario_preferido?: string; // 'Mañana', 'Tarde', 'Noche'

  @Prop()
  distracciones?: string[]; // Factores que le distraen

  @Prop()
  motivacion?: string; // Nivel: 'Alta', 'Media', 'Baja'

  @Prop()
  apoyo_familiar?: boolean;

  @Prop()
  trabaja?: boolean;

  @Prop()
  horas_trabajo_semanales?: number;

  @Prop()
  observaciones?: string;
}

export const HabitoEstudioSchema = SchemaFactory.createForClass(HabitoEstudio);

// Índices
HabitoEstudioSchema.index({ id_estudiante: 1, fecha_encuesta: -1 });
HabitoEstudioSchema.index({ fecha_encuesta: -1 });
