import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificacionDocument = Notificacion & Document;

@Schema({ timestamps: true, collection: 'notificaciones' })
export class Notificacion {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Estudiante' })
  id_estudiante: Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: ['calificacion', 'asistencia', 'prediccion', 'aviso', 'tarea'],
    type: String 
  })
  tipo: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ default: false })
  leida: boolean;

  @Prop({ 
    required: true, 
    enum: ['alta', 'media', 'baja'],
    default: 'media',
    type: String 
  })
  prioridad: string;

  @Prop({ type: Object })
  metadata?: {
    id_calificacion?: string;
    id_asistencia?: string;
    id_prediccion?: string;
    asignatura?: string;
    nota?: number;
    [key: string]: any;
  };
}

export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);

// Índices
NotificacionSchema.index({ id_estudiante: 1, leida: 1 });
NotificacionSchema.index({ createdAt: -1 });
