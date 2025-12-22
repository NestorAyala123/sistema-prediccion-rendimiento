import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auditoria, AuditoriaDocument } from '../../schemas/auditoria.schema';

export interface CreateAuditoriaDto {
  usuario_id: string;
  usuario_email: string;
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW';
  modulo: string;
  datos_anteriores?: any;
  datos_nuevos?: any;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectModel(Auditoria.name)
    private auditoriaModel: Model<AuditoriaDocument>,
  ) {}

  // Registrar acción de auditoría
  async registrar(dto: CreateAuditoriaDto): Promise<Auditoria> {
    const auditoria = new this.auditoriaModel(dto);
    return await auditoria.save();
  }

  // Obtener todas las auditorías (con paginación)
  async findAll(
    page: number = 1,
    limit: number = 50,
    filtros?: {
      usuario_id?: string;
      accion?: string;
      modulo?: string;
      fecha_desde?: Date;
      fecha_hasta?: Date;
    },
  ): Promise<{ data: Auditoria[]; total: number; page: number; pages: number }> {
    const query: any = {};

    if (filtros?.usuario_id) query.usuario_id = filtros.usuario_id;
    if (filtros?.accion) query.accion = filtros.accion;
    if (filtros?.modulo) query.modulo = filtros.modulo;
    if (filtros?.fecha_desde || filtros?.fecha_hasta) {
      query.fecha = {};
      if (filtros.fecha_desde) query.fecha.$gte = filtros.fecha_desde;
      if (filtros.fecha_hasta) query.fecha.$lte = filtros.fecha_hasta;
    }

    const skip = (page - 1) * limit;
    const total = await this.auditoriaModel.countDocuments(query);
    const data = await this.auditoriaModel
      .find(query)
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Obtener auditorías por usuario
  async findByUsuario(
    usuario_id: string,
    limit: number = 50,
  ): Promise<Auditoria[]> {
    return await this.auditoriaModel
      .find({ usuario_id })
      .sort({ fecha: -1 })
      .limit(limit)
      .exec();
  }

  // Obtener auditorías por módulo
  async findByModulo(modulo: string, limit: number = 50): Promise<Auditoria[]> {
    return await this.auditoriaModel
      .find({ modulo })
      .sort({ fecha: -1 })
      .limit(limit)
      .exec();
  }

  // Obtener auditorías por acción
  async findByAccion(accion: string, limit: number = 50): Promise<Auditoria[]> {
    return await this.auditoriaModel
      .find({ accion })
      .sort({ fecha: -1 })
      .limit(limit)
      .exec();
  }

  // Obtener estadísticas de auditoría
  async getEstadisticas(
    fecha_desde?: Date,
    fecha_hasta?: Date,
  ): Promise<any> {
    const match: any = {};
    if (fecha_desde || fecha_hasta) {
      match.fecha = {};
      if (fecha_desde) match.fecha.$gte = fecha_desde;
      if (fecha_hasta) match.fecha.$lte = fecha_hasta;
    }

    const stats = await this.auditoriaModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$accion',
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const porModulo = await this.auditoriaModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$modulo',
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return {
      por_accion: stats,
      por_modulo: porModulo,
    };
  }

  // Eliminar auditorías antiguas (opcional - para mantenimiento)
  async eliminarAntiguos(dias: number = 90): Promise<number> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const resultado = await this.auditoriaModel.deleteMany({
      fecha: { $lt: fechaLimite },
    });

    return resultado.deletedCount || 0;
  }
}
