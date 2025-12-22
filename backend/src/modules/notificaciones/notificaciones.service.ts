import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notificacion } from '../../schemas/notificacion.schema';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name)
    private notificacionModel: Model<Notificacion>,
  ) {}

  async crear(data: {
    id_estudiante: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    prioridad?: string;
    metadata?: any;
  }) {
    const notificacion = new this.notificacionModel({
      id_estudiante: new Types.ObjectId(data.id_estudiante),
      tipo: data.tipo,
      titulo: data.titulo,
      mensaje: data.mensaje,
      prioridad: data.prioridad || 'media',
      metadata: data.metadata,
      leida: false,
    });

    return notificacion.save();
  }

  async obtenerPorEstudiante(id_estudiante: string, limite?: number) {
    const query = this.notificacionModel
      .find({ id_estudiante: new Types.ObjectId(id_estudiante) })
      .sort({ createdAt: -1 });

    if (limite) {
      query.limit(limite);
    }

    return query.exec();
  }

  async obtenerNoLeidas(id_estudiante: string) {
    return this.notificacionModel
      .find({ 
        id_estudiante: new Types.ObjectId(id_estudiante),
        leida: false 
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async marcarComoLeida(id_notificacion: string) {
    return this.notificacionModel
      .findByIdAndUpdate(
        id_notificacion,
        { leida: true },
        { new: true }
      )
      .exec();
  }

  async marcarTodasComoLeidas(id_estudiante: string) {
    return this.notificacionModel
      .updateMany(
        { id_estudiante: new Types.ObjectId(id_estudiante), leida: false },
        { leida: true }
      )
      .exec();
  }

  async eliminar(id_notificacion: string) {
    return this.notificacionModel.findByIdAndDelete(id_notificacion).exec();
  }

  async contarNoLeidas(id_estudiante: string): Promise<number> {
    return this.notificacionModel
      .countDocuments({ 
        id_estudiante: new Types.ObjectId(id_estudiante),
        leida: false 
      })
      .exec();
  }

  // Métodos helper para crear notificaciones específicas
  async notificarNuevaCalificacion(
    id_estudiante: string,
    asignatura: string,
    nota: number,
    tipo_evaluacion: string,
    id_calificacion: string
  ) {
    const prioridad = nota < 6 ? 'alta' : nota < 8 ? 'media' : 'baja';
    return this.crear({
      id_estudiante,
      tipo: 'calificacion',
      titulo: 'Nueva Calificación',
      mensaje: `Se ha registrado tu calificación en ${asignatura}: ${nota}/10 (${tipo_evaluacion})`,
      prioridad,
      metadata: {
        id_calificacion,
        asignatura,
        nota,
        tipo_evaluacion,
      },
    });
  }

  async notificarAsistencia(
    id_estudiante: string,
    asignatura: string,
    estado: string,
    fecha: Date,
    id_asistencia: string
  ) {
    const mensaje = estado === 'presente' 
      ? `Tu asistencia a ${asignatura} ha sido confirmada.`
      : `Se ha registrado tu ${estado} en ${asignatura}.`;

    return this.crear({
      id_estudiante,
      tipo: 'asistencia',
      titulo: estado === 'presente' ? 'Asistencia Registrada' : 'Inasistencia Registrada',
      mensaje,
      prioridad: estado === 'presente' ? 'baja' : 'media',
      metadata: {
        id_asistencia,
        asignatura,
        estado,
        fecha,
      },
    });
  }

  async notificarPrediccionRiesgo(
    id_estudiante: string,
    nivel_riesgo: string,
    factores_clave: string[],
    id_prediccion: string
  ) {
    const prioridad = nivel_riesgo === 'Alto' ? 'alta' : nivel_riesgo === 'Medio' ? 'media' : 'baja';
    const mensaje = nivel_riesgo === 'Alto'
      ? 'Tu predicción de riesgo académico ha sido actualizada a ALTO. Se recomienda contactar con tu asesor académico.'
      : nivel_riesgo === 'Medio'
      ? 'Tu predicción de riesgo académico ha sido actualizada a MEDIO. Se recomienda revisar tu desempeño.'
      : 'Tu predicción de riesgo académico se mantiene en nivel BAJO. ¡Sigue así!';

    return this.crear({
      id_estudiante,
      tipo: 'prediccion',
      titulo: 'Actualización de Predicción de Riesgo',
      mensaje,
      prioridad,
      metadata: {
        id_prediccion,
        nivel_riesgo,
        factores_clave,
      },
    });
  }
}
