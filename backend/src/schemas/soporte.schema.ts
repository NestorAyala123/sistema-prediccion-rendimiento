import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SoporteDocument = Soporte & Document;

@Schema({ timestamps: true, collection: 'soporte' })
export class Soporte {
  @Prop({ required: true })
  asunto: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ default: 'abierto' })
  estado: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const SoporteSchema = SchemaFactory.createForClass(Soporte);
