import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EstadisticaDocument = Estadistica & Document;

@Schema({ timestamps: true, collection: 'estadisticas' })
export class Estadistica {
  @Prop({ required: true })
  tipo: string; // 'rendimiento_curso', 'asistencia_periodo', 'calificaciones_asignatura'

  @Prop({ required: true })
  periodo_academico: string;

  @Prop()
  asignatura_id?: string;

  @Prop()
  curso_nivel?: string;

  @Prop({ type: Object, required: true })
  datos: {
    total_estudiantes?: number;
    promedio_general?: number;
    promedio_asistencia?: number;
    estudiantes_riesgo_alto?: number;
    estudiantes_riesgo_medio?: number;
    estudiantes_riesgo_bajo?: number;
    tasa_aprobacion?: number;
    tasa_reprobacion?: number;
    [key: string]: any;
  };

  @Prop({ type: [Object] })
  distribucion?: Array<{
    rango: string;
    cantidad: number;
    porcentaje: number;
  }>;

  @Prop({ default: Date.now })
  fecha_calculo: Date;

  @Prop({ type: Object })
  metadata?: any;
}

export const EstadisticaSchema = SchemaFactory.createForClass(Estadistica);

// Índices
EstadisticaSchema.index({ tipo: 1, periodo_academico: 1 });
EstadisticaSchema.index({ periodo_academico: 1, fecha_calculo: -1 });
EstadisticaSchema.index({ asignatura_id: 1, periodo_academico: 1 });
