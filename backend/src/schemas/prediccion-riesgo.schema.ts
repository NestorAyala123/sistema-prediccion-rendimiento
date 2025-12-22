import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrediccionRiesgoDocument = PrediccionRiesgo & Document;

@Schema({ timestamps: true, collection: 'predicciones_riesgo' })
export class PrediccionRiesgo {
  @Prop({ required: true })
  id_estudiante: string;

  @Prop()
  periodo_academico?: string;

  @Prop({ required: true, default: Date.now })
  fecha_prediccion: Date;

  @Prop({ required: true, enum: ['Bajo', 'Medio', 'Alto', 'Crítico'], default: 'Bajo' })
  nivel_riesgo: string;

  @Prop({ min: 0, max: 100 })
  probabilidad_desercion?: number; // Porcentaje

  @Prop({ type: Object })
  factores_riesgo?: {
    promedio_bajo?: boolean;
    asistencia_baja?: boolean;
    habitos_inadecuados?: boolean;
    problemas_economicos?: boolean;
    falta_motivacion?: boolean;
  };

  @Prop()
  factores_clave: string; // Descripción textual de los factores

  @Prop({ type: Object })
  metricas?: {
    promedio_actual?: number;
    porcentaje_asistencia?: number;
    materias_reprobadas?: number;
    horas_estudio?: number;
  };

  @Prop()
  recomendaciones?: string[]; // Array de recomendaciones

  @Prop({ enum: ['Calculando', 'Completado', 'Error'], default: 'Calculando' })
  estado_prediccion: string;

  @Prop()
  modelo_usado?: string; // Nombre del modelo de ML usado

  @Prop()
  version_modelo?: string;

  @Prop()
  generado_por?: string; // Sistema o usuario que generó la predicción
}

export const PrediccionRiesgoSchema = SchemaFactory.createForClass(PrediccionRiesgo);

// Índices
PrediccionRiesgoSchema.index({ id_estudiante: 1, fecha_prediccion: -1 });
PrediccionRiesgoSchema.index({ nivel_riesgo: 1 });
PrediccionRiesgoSchema.index({ periodo_academico: -1 });
PrediccionRiesgoSchema.index({ estado_prediccion: 1 });
