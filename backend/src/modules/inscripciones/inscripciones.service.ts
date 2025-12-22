import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inscripcion, InscripcionDocument } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaDocument } from '../../schemas/asignatura.schema';
import { Calificacion, CalificacionDocument } from '../../schemas/calificacion.schema';
import { Asistencia, AsistenciaDocument } from '../../schemas/asistencia.schema';
import { CreateInscripcionDto, UpdateInscripcionDto } from './dto/inscripcion.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectModel(Inscripcion.name)
    private inscripcionesModel: Model<InscripcionDocument>,
    @InjectModel(Estudiante.name)
    private estudiantesModel: Model<EstudianteDocument>,
    @InjectModel(Asignatura.name)
    private asignaturasModel: Model<AsignaturaDocument>,
    @InjectModel(Calificacion.name)
    private calificacionesModel: Model<CalificacionDocument>,
    @InjectModel(Asistencia.name)
    private asistenciasModel: Model<AsistenciaDocument>,
  ) {}

  // Crear inscripción
  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    // Verificar que existe el estudiante
    const estudiante = await this.estudiantesModel
      .findOne({ id_estudiante: createInscripcionDto.id_estudiante })
      .exec();

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Verificar que existe la asignatura
    const asignatura = await this.asignaturasModel
      .findOne({ id_asignatura: createInscripcionDto.id_asignatura })
      .exec();

    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    // Verificar que no exista ya la inscripción
    const inscripcionExistente = await this.inscripcionesModel
      .findOne({
        id_estudiante: createInscripcionDto.id_estudiante,
        id_asignatura: createInscripcionDto.id_asignatura,
        periodo_academico: createInscripcionDto.periodo_academico,
      })
      .exec();

    if (inscripcionExistente) {
      throw new BadRequestException('El estudiante ya está inscrito en esta asignatura para este periodo');
    }

    const inscripcion = new this.inscripcionesModel(createInscripcionDto);
    return await inscripcion.save();
  }

  // Obtener todas las inscripciones
  async findAll(): Promise<any[]> {
    const inscripciones = await this.inscripcionesModel.find().exec();
    
    // Poblar datos manualmente
    const result = [];
    for (const insc of inscripciones) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: insc.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: insc.id_asignatura }).exec();
      const calificaciones = await this.calificacionesModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      const asistencias = await this.asistenciasModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      
      result.push({
        ...insc.toObject(),
        estudiante,
        asignatura,
        calificaciones,
        asistencias,
      });
    }
    
    return result;
  }

  // Obtener inscripciones por estudiante
  async findByEstudiante(id_estudiante: string): Promise<any[]> {
    const inscripciones = await this.inscripcionesModel
      .find({ id_estudiante })
      .sort({ periodo_academico: -1 })
      .exec();
    
    const result = [];
    for (const insc of inscripciones) {
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: insc.id_asignatura }).exec();
      const calificaciones = await this.calificacionesModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      const asistencias = await this.asistenciasModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      
      result.push({
        ...insc.toObject(),
        asignatura,
        calificaciones,
        asistencias,
      });
    }
    
    return result;
  }

  // Obtener inscripciones por periodo académico
  async findByPeriodo(periodo_academico: string): Promise<any[]> {
    const inscripciones = await this.inscripcionesModel
      .find({ periodo_academico })
      .exec();
    
    const result = [];
    for (const insc of inscripciones) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: insc.id_estudiante }).exec();
      const asignatura = await this.asignaturasModel.findOne({ id_asignatura: insc.id_asignatura }).exec();
      const calificaciones = await this.calificacionesModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      
      result.push({
        ...insc.toObject(),
        estudiante,
        asignatura,
        calificaciones,
      });
    }
    
    return result;
  }

  // Obtener inscripciones por asignatura
  async findByAsignatura(id_asignatura: string): Promise<any[]> {
    const inscripciones = await this.inscripcionesModel
      .find({ id_asignatura })
      .sort({ periodo_academico: -1 })
      .exec();
    
    const result = [];
    for (const insc of inscripciones) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: insc.id_estudiante }).exec();
      const calificaciones = await this.calificacionesModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      const asistencias = await this.asistenciasModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      
      result.push({
        ...insc.toObject(),
        estudiante,
        calificaciones,
        asistencias,
      });
    }
    
    return result;
  }

  // Obtener inscripciones por asignatura y periodo
  async findByAsignaturaYPeriodo(id_asignatura: string, periodo_academico: string): Promise<any[]> {
    const inscripciones = await this.inscripcionesModel
      .find({ id_asignatura, periodo_academico })
      .exec();
    
    const result = [];
    for (const insc of inscripciones) {
      const estudiante = await this.estudiantesModel.findOne({ id_estudiante: insc.id_estudiante }).exec();
      const calificaciones = await this.calificacionesModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      const asistencias = await this.asistenciasModel.find({ 
        id_estudiante: insc.id_estudiante,
        id_asignatura: insc.id_asignatura,
        periodo_academico: insc.periodo_academico
      }).exec();
      
      result.push({
        ...insc.toObject(),
        estudiante,
        calificaciones,
        asistencias,
      });
    }
    
    return result;
  }

  // Obtener una inscripción específica
  async findOne(id: string): Promise<any> {
    const inscripcion = await this.inscripcionesModel
      .findById(id)
      .exec();

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    const estudiante = await this.estudiantesModel.findOne({ id_estudiante: inscripcion.id_estudiante }).exec();
    const asignatura = await this.asignaturasModel.findOne({ id_asignatura: inscripcion.id_asignatura }).exec();
    const calificaciones = await this.calificacionesModel.find({ 
      id_estudiante: inscripcion.id_estudiante,
      id_asignatura: inscripcion.id_asignatura,
      periodo_academico: inscripcion.periodo_academico
    }).exec();
    const asistencias = await this.asistenciasModel.find({ 
      id_estudiante: inscripcion.id_estudiante,
      id_asignatura: inscripcion.id_asignatura,
      periodo_academico: inscripcion.periodo_academico
    }).exec();

    return {
      ...inscripcion.toObject(),
      estudiante,
      asignatura,
      calificaciones,
      asistencias,
    };
  }

  // Actualizar inscripción (solo periodo académico)
  async update(id: string, updateInscripcionDto: UpdateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionesModel
      .findByIdAndUpdate(
        id,
        { $set: updateInscripcionDto },
        { new: true }
      )
      .exec();

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return inscripcion;
  }

  // Eliminar inscripción
  async remove(id: string): Promise<void> {
    const result = await this.inscripcionesModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException('Inscripción no encontrada');
    }
  }

  // Obtener estadísticas de inscripciones por periodo
  async getEstadisticasPorPeriodo(periodo_academico: string): Promise<any> {
    const inscripciones = await this.findByPeriodo(periodo_academico);

    return {
      total_inscripciones: inscripciones.length,
      total_estudiantes: new Set(inscripciones.map(i => i.id_estudiante)).size,
      total_asignaturas: new Set(inscripciones.map(i => i.id_asignatura)).size,
      inscripciones_por_asignatura: inscripciones.reduce((acc, insc) => {
        const key = `${insc.asignatura.id_asignatura} - ${insc.asignatura.nombre_asignatura}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    };
  }
}
