import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrediccionRiesgo, PrediccionRiesgoDocument } from '../../schemas/prediccion-riesgo.schema';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import axios from 'axios';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class PrediccionesService {
  private readonly predictorUrl: string;

  constructor(
    @InjectModel(PrediccionRiesgo.name)
    private prediccionesModel: Model<PrediccionRiesgoDocument>,
    @InjectModel(Estudiante.name)
    private estudiantesModel: Model<EstudianteDocument>,
    private notificacionesService: NotificacionesService,
  ) {
    // Usar variable de entorno o localhost por defecto
    this.predictorUrl = process.env.PREDICTOR_API_URL || 'http://localhost:8000';
  }

  async findAll(): Promise<any[]> {
    const predicciones = await this.prediccionesModel
      .find()
      .sort({ fecha_prediccion: -1 })
      .exec();

    // Formatear respuesta para incluir nombres y apellidos del estudiante
    const result = [];
    for (const pred of predicciones) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: pred.id_estudiante }).exec();
      result.push({
        id_prediccion: pred._id,
        id_estudiante: pred.id_estudiante,
        nombres: estudiante?.nombres || '',
        apellidos: estudiante?.apellidos || '',
        fecha_prediccion: pred.fecha_prediccion,
        nivel_riesgo: pred.nivel_riesgo,
        factores_clave: pred.factores_clave,
        estado_prediccion: pred.estado_prediccion,
      });
    }
    
    return result;
  }

  async findByEstudiante(id_estudiante: string): Promise<PrediccionRiesgo[]> {
    return this.prediccionesModel
      .find({ id_estudiante })
      .sort({ fecha_prediccion: -1 })
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const prediccion = await this.prediccionesModel
      .findById(id)
      .exec();

    if (!prediccion) {
      throw new NotFoundException(`Predicción ${id} no encontrada`);
    }

    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: prediccion.id_estudiante }).exec();

    return {
      ...prediccion.toObject(),
      estudiante,
    };
  }

  async crear(id_estudiante: string, data?: any): Promise<any> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudiantesModel
      .findOne({ id_estudiante })
      .exec();

    if (!estudiante) {
      throw new NotFoundException(`Estudiante ${id_estudiante} no encontrado`);
    }

    try {
      // Llamar al microservicio de predicción de IA
      const estudianteInput = {
        id_estudiante: estudiante.id_estudiante,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        semestre_actual: data?.semestre_actual || 1,
        notas_promedio: data?.notas_promedio || 0,
        notas_examenes_promedio: data?.notas_examenes_promedio || 0,
        entregas_tareas_porcentaje: data?.entregas_tareas_porcentaje || 0,
        asistencia_porcentaje: data?.asistencia_porcentaje || 0,
        horas_estudio_semana: data?.horas_estudio_semana || 0,
        participacion_clase: data?.participacion_clase || 'media',
        usa_tecnicas_estudio: data?.usa_tecnicas_estudio || false,
      };

      const response = await axios.post(`${this.predictorUrl}/predict`, estudianteInput, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });

      const prediccionIA = response.data;

      // Guardar la predicción en la base de datos
      const prediccion = new this.prediccionesModel({
        id_estudiante,
        nivel_riesgo: prediccionIA.riesgo.charAt(0).toUpperCase() + prediccionIA.riesgo.slice(1),
        factores_clave: prediccionIA.factores_criticos.join(', '),
        estado_prediccion: 'Completado',
      });

      const prediccionGuardada = await prediccion.save();

      // Crear notificación para el estudiante
      try {
        const factoresClave = prediccionIA.factores_criticos || [];
        await this.notificacionesService.notificarPrediccionRiesgo(
          estudiante._id.toString(),
          prediccionGuardada.nivel_riesgo,
          factoresClave,
          prediccionGuardada._id.toString()
        );
      } catch (notifError) {
        console.error('Error al crear notificación de predicción:', notifError);
      }

      // Devolver predicción completa con datos del estudiante y de la IA
      return {
        id_prediccion: prediccionGuardada._id,
        id_estudiante: prediccionGuardada.id_estudiante,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        fecha_prediccion: prediccionGuardada.fecha_prediccion,
        nivel_riesgo: prediccionGuardada.nivel_riesgo,
        factores_clave: prediccionGuardada.factores_clave,
        estado_prediccion: prediccionGuardada.estado_prediccion,
        // Datos adicionales de la IA
        probabilidad: prediccionIA.probabilidad,
        puntuacion: prediccionIA.puntuacion,
        recomendaciones: prediccionIA.recomendaciones,
        modelo_version: prediccionIA.modelo_version,
      };
    } catch (error) {
      console.error('Error al llamar al microservicio de predicción:', error.message);
      
      // Si el microservicio no está disponible, usar lógica de fallback
      const prediccion = new this.prediccionesModel({
        id_estudiante,
        nivel_riesgo: data?.nivel_riesgo || this.calcularNivelRiesgo(data),
        factores_clave: data?.factores_clave || this.generarFactoresClave(data),
        estado_prediccion: 'Completado (Fallback)',
      });

      const prediccionGuardada = await prediccion.save();

      // Crear notificación para el estudiante (fallback)
      try {
        const factoresClave = prediccionGuardada.factores_clave ? prediccionGuardada.factores_clave.split(', ') : [];
        await this.notificacionesService.notificarPrediccionRiesgo(
          estudiante._id.toString(),
          prediccionGuardada.nivel_riesgo,
          factoresClave,
          prediccionGuardada._id.toString()
        );
      } catch (notifError) {
        console.error('Error al crear notificación de predicción:', notifError);
      }

      return {
        id_prediccion: prediccionGuardada._id,
        id_estudiante: prediccionGuardada.id_estudiante,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        fecha_prediccion: prediccionGuardada.fecha_prediccion,
        nivel_riesgo: prediccionGuardada.nivel_riesgo,
        factores_clave: prediccionGuardada.factores_clave,
        estado_prediccion: prediccionGuardada.estado_prediccion,
        advertencia: 'Predicción generada con lógica de respaldo (microservicio IA no disponible)',
      };
    }
  }

  private calcularNivelRiesgo(data: any): string {
    // Lógica simple de cálculo de riesgo
    if (!data) return 'Medio';

    const notasPromedio = data.notas_promedio || 0;
    const asistencia = data.asistencia_porcentaje || 0;

    if (notasPromedio < 5 || asistencia < 60) return 'Alto';
    if (notasPromedio < 7 || asistencia < 80) return 'Medio';
    return 'Bajo';
  }

  private generarFactoresClave(data: any): string {
    if (!data) return 'Sin datos disponibles para análisis';

    const factores: string[] = [];

    if (data.notas_promedio < 5) {
      factores.push(`Notas bajas (${data.notas_promedio}/10)`);
    }
    if (data.asistencia_porcentaje < 70) {
      factores.push(`${100 - data.asistencia_porcentaje}% de inasistencia`);
    }
    if (data.horas_estudio_semana < 5) {
      factores.push('Pocas horas de estudio semanales');
    }
    if (data.entregas_tareas_porcentaje < 70) {
      factores.push('Bajo porcentaje de entregas');
    }

    if (factores.length === 0) {
      factores.push('Buen rendimiento general');
    }

    return factores.join(', ');
  }
}
