import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrediccionAnalisisDocument = PrediccionAnalisis & Document;

@Schema({ timestamps: true, collection: 'predicciones_analisis' })
export class PrediccionAnalisis {
  @Prop({ required: true })
  estudiante_id: string;

  @Prop({ required: true })
  periodo_academico: string;

  @Prop({ required: true })
  modelo_usado: string; // 'RandomForest', 'NeuralNetwork', 'LogisticRegression'

  @Prop({ required: true, enum: ['Alto', 'Medio', 'Bajo'] })
  nivel_riesgo: string;

  @Prop({ required: true, min: 0, max: 100 })
  probabilidad_riesgo: number;

  @Prop({ type: Object, required: true })
  factores_riesgo: {
    asistencia: number;
    promedio_notas: number;
    habitos_estudio: number;
    participacion: number;
    [key: string]: number;
  };

  @Prop({ type: [String] })
  recomendaciones: string[];

  @Prop({ type: Object })
  datos_entrada: any;

  @Prop({ type: Object })
  metricas_modelo: {
    precision: number;
    recall: number;
    f1_score: number;
    accuracy: number;
  };

  @Prop()
  tiempo_procesamiento_ms: number;

  @Prop({ default: Date.now })
  fecha_prediccion: Date;

  @Prop({ type: Object })
  metadata?: any;
}

export const PrediccionAnalisisSchema = SchemaFactory.createForClass(PrediccionAnalisis);

// Índices
PrediccionAnalisisSchema.index({ estudiante_id: 1, fecha_prediccion: -1 });
PrediccionAnalisisSchema.index({ periodo_academico: 1, nivel_riesgo: 1 });
PrediccionAnalisisSchema.index({ nivel_riesgo: 1, fecha_prediccion: -1 });
