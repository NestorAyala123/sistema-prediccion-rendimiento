import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true, enum: ['admin', 'docente'] })
  rol: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop()
  ultimo_acceso?: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// Índices
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ rol: 1 });
