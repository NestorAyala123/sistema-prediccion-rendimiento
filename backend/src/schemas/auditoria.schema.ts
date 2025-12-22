import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditoriaDocument = Auditoria & Document;

@Schema({ timestamps: true, collection: 'auditorias' })
export class Auditoria {
  @Prop({ required: true })
  usuario_id: string;

  @Prop({ required: true })
  usuario_email: string;

  @Prop({ required: true })
  accion: string; // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'

  @Prop({ required: true })
  modulo: string; // 'estudiantes', 'calificaciones', 'auth', etc.

  @Prop({ type: Object })
  datos_anteriores?: any;

  @Prop({ type: Object })
  datos_nuevos?: any;

  @Prop()
  ip_address?: string;

  @Prop()
  user_agent?: string;

  @Prop({ default: Date.now })
  fecha: Date;

  @Prop({ type: Object })
  metadata?: any;
}

export const AuditoriaSchema = SchemaFactory.createForClass(Auditoria);

// Índices para mejorar búsquedas
AuditoriaSchema.index({ usuario_id: 1, fecha: -1 });
AuditoriaSchema.index({ accion: 1, fecha: -1 });
AuditoriaSchema.index({ modulo: 1, fecha: -1 });
