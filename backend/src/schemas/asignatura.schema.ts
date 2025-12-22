import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AsignaturaDocument = Asignatura & Document;

@Schema({ timestamps: true, collection: 'asignaturas' })
export class Asignatura {
  @Prop({ required: true, unique: true })
  id_asignatura: string; // Código de materia

  @Prop({ required: true })
  nombre_asignatura: string;

  @Prop({ required: true, default: 3 })
  creditos: number;

  @Prop()
  descripcion?: string;

  @Prop()
  semestre?: number;

  @Prop()
  prerequisitos?: string[]; // Array de códigos de asignaturas

  @Prop()
  departamento?: string;

  @Prop({ default: true })
  activo: boolean;
}

export const AsignaturaSchema = SchemaFactory.createForClass(Asignatura);

// Índices
AsignaturaSchema.index({ id_asignatura: 1 });
AsignaturaSchema.index({ nombre_asignatura: 1 });
AsignaturaSchema.index({ semestre: 1 });
AsignaturaSchema.index({ departamento: 1 });
