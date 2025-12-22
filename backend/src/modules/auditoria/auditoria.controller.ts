import { Controller, Get, Post, Query, Param, UseGuards, Req } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  // Obtener todas las auditorías (solo admin)
  @Get()
  @Roles('administrador')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('usuario_id') usuario_id?: string,
    @Query('accion') accion?: string,
    @Query('modulo') modulo?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    const filtros: any = {};
    if (usuario_id) filtros.usuario_id = usuario_id;
    if (accion) filtros.accion = accion;
    if (modulo) filtros.modulo = modulo;
    if (fecha_desde) filtros.fecha_desde = new Date(fecha_desde);
    if (fecha_hasta) filtros.fecha_hasta = new Date(fecha_hasta);

    return await this.auditoriaService.findAll(
      parseInt(page),
      parseInt(limit),
      filtros,
    );
  }

  // Obtener auditorías por usuario (admin o el mismo usuario)
  @Get('usuario/:id')
  @Roles('administrador', 'docente', 'estudiante')
  async findByUsuario(
    @Param('id') id: string,
    @Query('limit') limit: string = '50',
    @Req() req: any,
  ) {
    // Verificar que el usuario solo pueda ver sus propias auditorías (a menos que sea admin)
    const user = req.user;
    if (user.role !== 'administrador' && user.sub !== id) {
      throw new Error('No autorizado para ver estas auditorías');
    }

    return await this.auditoriaService.findByUsuario(id, parseInt(limit));
  }

  // Obtener auditorías por módulo (solo admin)
  @Get('modulo/:modulo')
  @Roles('administrador')
  async findByModulo(
    @Param('modulo') modulo: string,
    @Query('limit') limit: string = '50',
  ) {
    return await this.auditoriaService.findByModulo(modulo, parseInt(limit));
  }

  // Obtener estadísticas de auditoría (solo admin)
  @Get('estadisticas')
  @Roles('administrador')
  async getEstadisticas(
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    const desde = fecha_desde ? new Date(fecha_desde) : undefined;
    const hasta = fecha_hasta ? new Date(fecha_hasta) : undefined;

    return await this.auditoriaService.getEstadisticas(desde, hasta);
  }

  // Eliminar auditorías antiguas (solo admin)
  @Post('limpiar')
  @Roles('administrador')
  async eliminarAntiguos(@Query('dias') dias: string = '90') {
    const eliminados = await this.auditoriaService.eliminarAntiguos(parseInt(dias));
    return {
      mensaje: `Se eliminaron ${eliminados} registros de auditoría`,
      eliminados,
    };
  }
}
