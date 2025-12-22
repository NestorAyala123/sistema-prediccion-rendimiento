import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calificacion, CalificacionDocument } from '../../schemas/calificacion.schema';
import { Inscripcion, InscripcionDocument } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaDocument } from '../../schemas/asignatura.schema';
import { CreateCalificacionDto, CreateCalificacionPorPeriodoDto, UpdateCalificacionDto } from './dto/calificacion.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectModel(Calificacion.name)
    private calificacionesModel: Model<CalificacionDocument>,
    @InjectModel(Inscripcion.name)
    private inscripcionesModel: Model<InscripcionDocument>,
    @InjectModel(Estudiante.name)
    private estudiantesModel: Model<EstudianteDocument>,
    @InjectModel(Asignatura.name)
    private asignaturasModel: Model<AsignaturaDocument>,
    private notificacionesService: NotificacionesService,
  ) {}

  // Crear calificación por inscripción directa
  async create(createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
    const inscripcion = await this.inscripcionesModel
      .findById(createCalificacionDto.id_inscripcion)
      .exec();

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    const calificacion = new this.calificacionesModel({
      id_estudiante: inscripcion.id_estudiante,
      id_asignatura: inscripcion.id_asignatura,
      periodo_academico: inscripcion.periodo_academico,
      tipo_evaluacion: createCalificacionDto.tipo_evaluacion,
      nota: createCalificacionDto.nota,
    });

    const savedCalificacion = await calificacion.save();

    // Buscar información de la asignatura para la notificación
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: inscripcion.id_asignatura }).exec();
    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: inscripcion.id_estudiante }).exec();

    // Crear notificación para el estudiante
    if (estudiante && asignatura) {
      try {
        await this.notificacionesService.notificarNuevaCalificacion(
          estudiante._id.toString(),
          asignatura.nombre_asignatura,
          createCalificacionDto.nota,
          createCalificacionDto.tipo_evaluacion,
          savedCalificacion._id.toString()
        );
      } catch (error) {
        console.error('Error al crear notificación:', error);
      }
    }

    return savedCalificacion;
  }

  // Crear calificación por periodo académico y materia
  async createPorPeriodo(dto: CreateCalificacionPorPeriodoDto): Promise<Calificacion> {
    // Buscar o crear la inscripción
    let inscripcion = await this.inscripcionesModel
      .findOne({
        id_estudiante: dto.id_estudiante,
        id_asignatura: dto.id_asignatura,
        periodo_academico: dto.periodo_academico,
      })
      .exec();

    // Si no existe la inscripción, crearla
    if (!inscripcion) {
      inscripcion = new this.inscripcionesModel({
        id_estudiante: dto.id_estudiante,
        id_asignatura: dto.id_asignatura,
        periodo_academico: dto.periodo_academico,
      });
      inscripcion = await inscripcion.save();
    }

    // Crear la calificación
    const calificacion = new this.calificacionesModel({
      id_estudiante: dto.id_estudiante,
      id_asignatura: dto.id_asignatura,
      periodo_academico: dto.periodo_academico,
      tipo_evaluacion: dto.tipo_evaluacion,
      nota: dto.nota,
    });

    const savedCalificacion = await calificacion.save();

    // Buscar información para la notificación
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: dto.id_asignatura }).exec();
    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: dto.id_estudiante }).exec();

    // Crear notificación para el estudiante
    if (estudiante && asignatura) {
      try {
        await this.notificacionesService.notificarNuevaCalificacion(
          estudiante._id.toString(),
          asignatura.nombre_asignatura,
          dto.nota,
          dto.tipo_evaluacion,
          savedCalificacion._id.toString()
        );
      } catch (error) {
        console.error('Error al crear notificación:', error);
      }
    }

    return savedCalificacion;
  }

  // Obtener todas las calificaciones
  async findAll(): Promise<any[]> {
    const calificaciones = await this.calificacionesModel.find().exec();
    
    const result = [];
    for (const cal of calificaciones) {
      const inscripcion = await this.inscripcionesModel.findOne({
        id_estudiante: cal.id_estudiante,
        id_asignatura: cal.id_asignatura,
        periodo_academico: cal.periodo_academico,
      }).exec();
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: cal.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: cal.id_asignatura }).exec();
      
      result.push({
        ...cal.toObject(),
        inscripcion: {
          ...inscripcion?.toObject(),
          estudiante,
          asignatura,
        },
      });
    }
    
    return result;
  }

  // Obtener calificaciones por estudiante
  async findByEstudiante(id_estudiante: string): Promise<any[]> {
    const calificaciones = await this.calificacionesModel
      .find({ id_estudiante })
      .sort({ periodo_academico: -1 })
      .exec();

    // Agrupar por periodo y asignatura
    const grouped: Record<string, any> = {};
    
    for (const cal of calificaciones) {
      const key = `${cal.periodo_academico}_${cal.id_asignatura}`;
      
      if (!grouped[key]) {
        const asignatura = await this.asignaturasModel.findOne({ id_asignatura: cal.id_asignatura }).exec();
        grouped[key] = {
          periodo_academico: cal.periodo_academico,
          asignatura: asignatura?.nombre_asignatura || '',
          id_asignatura: cal.id_asignatura,
          creditos: asignatura?.creditos || 0,
          calificaciones: [],
        };
      }
      
      grouped[key].calificaciones.push({
        id_calificacion: cal._id,
        tipo_evaluacion: cal.tipo_evaluacion,
        nota: cal.nota,
        fecha_registro: cal.fecha_registro,
      });
    }

    return Object.values(grouped).map(group => ({
      ...group,
      promedio: group.calificaciones.length > 0
        ? group.calificaciones.reduce((sum: number, cal: any) => sum + Number(cal.nota), 0) / group.calificaciones.length
        : 0,
    }));
  }

  // Obtener calificaciones por periodo académico
  async findByPeriodo(periodo_academico: string): Promise<any[]> {
    const calificaciones = await this.calificacionesModel
      .find({ periodo_academico })
      .exec();

    // Agrupar por estudiante y asignatura
    const grouped: Record<string, any> = {};
    
    for (const cal of calificaciones) {
      const key = `${cal.id_estudiante}_${cal.id_asignatura}`;
      
      if (!grouped[key]) {
        const estudiante = await this.estudiantesModel.findOne({ id_estudiante: cal.id_estudiante }).exec();
        const asignatura = await this.asignaturasModel.findOne({ id_asignatura: cal.id_asignatura }).exec();
        
        grouped[key] = {
          estudiante: {
            id: estudiante?.id_estudiante || '',
            nombres: estudiante?.nombres || '',
            apellidos: estudiante?.apellidos || '',
          },
          asignatura: {
            id: asignatura?.id_asignatura || '',
            nombre: asignatura?.nombre_asignatura || '',
            creditos: asignatura?.creditos || 0,
          },
          calificaciones: [],
        };
      }
      
      grouped[key].calificaciones.push({
        id_calificacion: cal._id,
        tipo_evaluacion: cal.tipo_evaluacion,
        nota: cal.nota,
        fecha_registro: cal.fecha_registro,
      });
    }

    return Object.values(grouped).map(group => ({
      ...group,
      promedio: group.calificaciones.length > 0
        ? group.calificaciones.reduce((sum: number, cal: any) => sum + Number(cal.nota), 0) / group.calificaciones.length
        : 0,
    }));
  }

  // Obtener calificaciones por asignatura y periodo
  async findByAsignaturaYPeriodo(id_asignatura: string, periodo_academico: string): Promise<any[]> {
    const calificaciones = await this.calificacionesModel
      .find({ id_asignatura, periodo_academico })
      .exec();

    // Agrupar por estudiante
    const grouped: Record<string, any> = {};
    
    for (const cal of calificaciones) {
      const key = cal.id_estudiante;
      
      if (!grouped[key]) {
        const estudiante = await this.estudiantesModel.findOne({ id_estudiante: cal.id_estudiante }).exec();
        
        grouped[key] = {
          estudiante: {
            id: estudiante?.id_estudiante || '',
            nombres: estudiante?.nombres || '',
            apellidos: estudiante?.apellidos || '',
            email: estudiante?.email || '',
          },
          calificaciones: [],
        };
      }
      
      grouped[key].calificaciones.push({
        id_calificacion: cal._id,
        tipo_evaluacion: cal.tipo_evaluacion,
        nota: cal.nota,
        fecha_registro: cal.fecha_registro,
      });
    }

    return Object.values(grouped).map(group => ({
      ...group,
      promedio: group.calificaciones.length > 0
        ? group.calificaciones.reduce((sum: number, cal: any) => sum + Number(cal.nota), 0) / group.calificaciones.length
        : 0,
    }));
  }

  // Obtener una calificación por ID
  async findOne(id: string): Promise<any> {
    const calificacion = await this.calificacionesModel
      .findById(id)
      .exec();

    if (!calificacion) {
      throw new NotFoundException('Calificación no encontrada');
    }

    const inscripcion = await this.inscripcionesModel.findOne({
      id_estudiante: calificacion.id_estudiante,
      id_asignatura: calificacion.id_asignatura,
      periodo_academico: calificacion.periodo_academico,
    }).exec();
    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: calificacion.id_estudiante }).exec();
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: calificacion.id_asignatura }).exec();

    return {
      ...calificacion.toObject(),
      inscripcion: {
        ...inscripcion?.toObject(),
        estudiante,
        asignatura,
      },
    };
  }

  // Actualizar calificación
  async update(id: string, updateCalificacionDto: UpdateCalificacionDto): Promise<Calificacion> {
    const calificacion = await this.calificacionesModel
      .findByIdAndUpdate(
        id,
        { $set: updateCalificacionDto },
        { new: true }
      )
      .exec();

    if (!calificacion) {
      throw new NotFoundException('Calificación no encontrada');
    }

    return calificacion;
  }

  // Eliminar calificación
  async remove(id: string): Promise<void> {
    const result = await this.calificacionesModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException('Calificación no encontrada');
    }
  }

  // Obtener promedio de un estudiante en un periodo
  async getPromedioEstudiantePeriodo(id_estudiante: string, periodo_academico: string): Promise<number> {
    const calificaciones = await this.calificacionesModel
      .find({ id_estudiante, periodo_academico })
      .exec();

    if (calificaciones.length === 0) {
      return 0;
    }

    const totalNotas = calificaciones.reduce((sum, cal) => sum + Number(cal.nota), 0);
    return totalNotas / calificaciones.length;
  }
}
