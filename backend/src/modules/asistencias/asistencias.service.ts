import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asistencia, AsistenciaDocument } from '../../schemas/asistencia.schema';
import { Inscripcion, InscripcionDocument } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaDocument } from '../../schemas/asignatura.schema';
import { CreateAsistenciaDto, UpdateAsistenciaDto } from './dto/asistencia.dto';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectModel(Asistencia.name)
    private asistenciasModel: Model<AsistenciaDocument>,
    @InjectModel(Inscripcion.name)
    private inscripcionesModel: Model<InscripcionDocument>,
    @InjectModel(Estudiante.name)
    private estudiantesModel: Model<EstudianteDocument>,
    @InjectModel(Asignatura.name)
    private asignaturasModel: Model<AsignaturaDocument>,
    private eventsGateway: EventsGateway,
  ) {}

  // Crear asistencias en lote
  async createLote(data: {
    id_asignatura: string;
    fecha_clase: string;
    periodo_academico: string;
    asistencias: Array<{ id_estudiante: string; estado: string }>;
  }): Promise<any> {
    const fecha = new Date(data.fecha_clase);
    const resultados = [];
    const errores = [];

    for (const asist of data.asistencias) {
      try {
        // Verificar si ya existe registro
        const existente = await this.asistenciasModel
          .findOne({
            id_estudiante: asist.id_estudiante,
            id_asignatura: data.id_asignatura,
            periodo_academico: data.periodo_academico,
            fecha_clase: fecha,
          })
          .exec();

        if (existente) {
          // Actualizar el registro existente
          existente.estado = asist.estado;
          await existente.save();
          resultados.push({ id_estudiante: asist.id_estudiante, actualizado: true });
        } else {
          // Crear nuevo registro
          const nuevaAsistencia = new this.asistenciasModel({
            id_estudiante: asist.id_estudiante,
            id_asignatura: data.id_asignatura,
            periodo_academico: data.periodo_academico,
            fecha_clase: fecha,
            estado: asist.estado,
          });
          await nuevaAsistencia.save();
          resultados.push({ id_estudiante: asist.id_estudiante, creado: true });
        }
      } catch (error) {
        errores.push({ id_estudiante: asist.id_estudiante, error: error.message });
      }
    }

    // 🔴 Emitir evento en tiempo real
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: data.id_asignatura }).exec();
    this.eventsGateway.emitAsistenciaLote({
      id_asignatura: data.id_asignatura,
      asignatura_nombre: asignatura?.nombre_asignatura || '',
      fecha_clase: data.fecha_clase,
      periodo_academico: data.periodo_academico,
      total: data.asistencias.length,
      exitosos: resultados.length,
      fallidos: errores.length,
    });

    return {
      exitosos: resultados.length,
      fallidos: errores.length,
      resultados,
      errores,
    };
  }

  // Crear asistencia
  async create(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    const inscripcion = await this.inscripcionesModel
      .findById(createAsistenciaDto.id_inscripcion)
      .exec();

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    // Verificar que no exista ya un registro de asistencia para la misma fecha
    const asistenciaExistente = await this.asistenciasModel
      .findOne({
        id_estudiante: inscripcion.id_estudiante,
        id_asignatura: inscripcion.id_asignatura,
        periodo_academico: inscripcion.periodo_academico,
        fecha_clase: createAsistenciaDto.fecha_clase,
      })
      .exec();

    if (asistenciaExistente) {
      throw new BadRequestException('Ya existe un registro de asistencia para esta fecha');
    }

    const asistencia = new this.asistenciasModel({
      id_estudiante: inscripcion.id_estudiante,
      id_asignatura: inscripcion.id_asignatura,
      periodo_academico: inscripcion.periodo_academico,
      fecha_clase: createAsistenciaDto.fecha_clase,
      estado: createAsistenciaDto.estado,
    });

    return await asistencia.save();
  }

  // Obtener todas las asistencias
  async findAll(): Promise<any[]> {
    const asistencias = await this.asistenciasModel
      .find()
      .sort({ fecha_clase: -1 })
      .exec();
    
    const result = [];
    for (const asist of asistencias) {
      const inscripcion = await this.inscripcionesModel.findOne({
        id_estudiante: asist.id_estudiante,
        id_asignatura: asist.id_asignatura,
        periodo_academico: asist.periodo_academico,
      }).exec();
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: asist.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: asist.id_asignatura }).exec();
      
      result.push({
        ...asist.toObject(),
        inscripcion: {
          ...inscripcion?.toObject(),
          estudiante,
          asignatura,
        },
      });
    }
    
    return result;
  }

  // Obtener asistencias por estudiante
  async findByEstudiante(id_estudiante: string): Promise<any[]> {
    const asistencias = await this.asistenciasModel
      .find({ id_estudiante })
      .exec();

    // Agrupar por periodo y asignatura
    const grouped: Record<string, any> = {};
    
    for (const asist of asistencias) {
      const key = `${asist.periodo_academico}_${asist.id_asignatura}`;
      
      if (!grouped[key]) {
        const asignatura = await this.asignaturasModel.findOne({ id_asignatura: asist.id_asignatura }).exec();
        grouped[key] = {
          periodo_academico: asist.periodo_academico,
          asignatura: asignatura?.nombre_asignatura || '',
          id_asignatura: asist.id_asignatura,
          asistencias: [],
        };
      }
      
      grouped[key].asistencias.push({
        id_asistencia: asist._id,
        fecha_clase: asist.fecha_clase,
        estado: asist.estado,
      });
    }

    return Object.values(grouped).map(group => {
      const asistencias = group.asistencias;
      const totalClases = asistencias.length;
      const presentes = asistencias.filter((a: any) => a.estado === 'Presente').length;
      const ausentes = asistencias.filter((a: any) => a.estado === 'Ausente').length;
      const justificadas = asistencias.filter((a: any) => a.estado === 'Justificado').length;
      
      return {
        ...group,
        total_clases: totalClases,
        presentes,
        ausentes,
        justificadas,
        porcentaje_asistencia: totalClases > 0
          ? ((presentes + justificadas) / totalClases * 100).toFixed(2)
          : 0,
      };
    });
  }

  // Obtener asistencias por inscripción
  async findByInscripcion(id_inscripcion: string): Promise<Asistencia[]> {
    const inscripcion = await this.inscripcionesModel.findById(id_inscripcion).exec();
    
    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }
    
    return await this.asistenciasModel
      .find({
        id_estudiante: inscripcion.id_estudiante,
        id_asignatura: inscripcion.id_asignatura,
        periodo_academico: inscripcion.periodo_academico,
      })
      .sort({ fecha_clase: -1 })
      .exec();
  }

  // Obtener asistencias por fecha
  async findByFecha(fecha: Date): Promise<any[]> {
    const asistencias = await this.asistenciasModel
      .find({ fecha_clase: fecha })
      .exec();
    
    const result = [];
    for (const asist of asistencias) {
      const inscripcion = await this.inscripcionesModel.findOne({
        id_estudiante: asist.id_estudiante,
        id_asignatura: asist.id_asignatura,
        periodo_academico: asist.periodo_academico,
      }).exec();
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: asist.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: asist.id_asignatura }).exec();
      
      result.push({
        ...asist.toObject(),
        inscripcion: {
          ...inscripcion?.toObject(),
          estudiante,
          asignatura,
        },
      });
    }
    
    return result;
  }

  // Obtener asistencias por rango de fechas
  async findByRangoFechas(fecha_inicio: Date, fecha_fin: Date): Promise<any[]> {
    const asistencias = await this.asistenciasModel
      .find({
        fecha_clase: { $gte: fecha_inicio, $lte: fecha_fin },
      })
      .sort({ fecha_clase: -1 })
      .exec();
    
    const result = [];
    for (const asist of asistencias) {
      const inscripcion = await this.inscripcionesModel.findOne({
        id_estudiante: asist.id_estudiante,
        id_asignatura: asist.id_asignatura,
        periodo_academico: asist.periodo_academico,
      }).exec();
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: asist.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: asist.id_asignatura }).exec();
      
      result.push({
        ...asist.toObject(),
        inscripcion: {
          ...inscripcion?.toObject(),
          estudiante,
          asignatura,
        },
      });
    }
    
    return result;
  }

  // Obtener una asistencia específica
  async findOne(id: string): Promise<any> {
    const asistencia = await this.asistenciasModel
      .findById(id)
      .exec();

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    const inscripcion = await this.inscripcionesModel.findOne({
      id_estudiante: asistencia.id_estudiante,
      id_asignatura: asistencia.id_asignatura,
      periodo_academico: asistencia.periodo_academico,
    }).exec();
    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: asistencia.id_estudiante }).exec();
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: asistencia.id_asignatura }).exec();

    return {
      ...asistencia.toObject(),
      inscripcion: {
        ...inscripcion?.toObject(),
        estudiante,
        asignatura,
      },
    };
  }

  // Actualizar asistencia
  async update(id: string, updateAsistenciaDto: UpdateAsistenciaDto): Promise<Asistencia> {
    const asistencia = await this.asistenciasModel
      .findByIdAndUpdate(
        id,
        { $set: updateAsistenciaDto },
        { new: true }
      )
      .exec();

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    return asistencia;
  }

  // Eliminar asistencia
  async remove(id: string): Promise<void> {
    const result = await this.asistenciasModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException('Asistencia no encontrada');
    }
  }

  // Obtener estadísticas de asistencia por asignatura y periodo
  async getEstadisticasPorAsignaturaYPeriodo(id_asignatura: string, periodo_academico: string): Promise<any> {
    const asistencias = await this.asistenciasModel
      .find({ id_asignatura, periodo_academico })
      .exec();

    // Agrupar por estudiante
    const grouped: Record<string, any[]> = {};
    
    for (const asist of asistencias) {
      const key = asist.id_estudiante;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(asist);
    }

    const estadisticas = [];
    for (const [id_estudiante, asistenciasEstudiante] of Object.entries(grouped)) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante }).exec();
      
      const totalClases = asistenciasEstudiante.length;
      const presentes = asistenciasEstudiante.filter(a => a.estado === 'Presente').length;
      const ausentes = asistenciasEstudiante.filter(a => a.estado === 'Ausente').length;
      const justificadas = asistenciasEstudiante.filter(a => a.estado === 'Justificado').length;
      const porcentaje = totalClases > 0 
        ? ((presentes + justificadas) / totalClases * 100).toFixed(2) 
        : 0;

      estadisticas.push({
        estudiante: {
          id: estudiante?.id_estudiante || '',
          nombre: estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : '',
        },
        total_clases: totalClases,
        presentes,
        ausentes,
        justificadas,
        porcentaje_asistencia: porcentaje,
        estado_riesgo: Number(porcentaje) < 75 ? 'En Riesgo' : 'Normal',
      });
    }

    return {
      asignatura: id_asignatura,
      periodo: periodo_academico,
      total_estudiantes: estadisticas.length,
      promedio_asistencia: estadisticas.length > 0
        ? (estadisticas.reduce((sum, e) => sum + Number(e.porcentaje_asistencia), 0) / estadisticas.length).toFixed(2)
        : 0,
      estudiantes_en_riesgo: estadisticas.filter(e => e.estado_riesgo === 'En Riesgo').length,
      detalles: estadisticas,
    };
  }
}
