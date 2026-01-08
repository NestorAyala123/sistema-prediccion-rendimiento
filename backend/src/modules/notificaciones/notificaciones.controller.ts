import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get('estudiante/:id_estudiante')
  async obtenerPorEstudiante(
    @Param('id_estudiante') id_estudiante: string,
    @Query('limite') limite?: string,
  ) {
    const limiteNum = limite ? parseInt(limite) : undefined;
    return this.notificacionesService.obtenerPorEstudiante(id_estudiante, limiteNum);
  }

  @Get('estudiante/:id_estudiante/no-leidas')
  async obtenerNoLeidas(@Param('id_estudiante') id_estudiante: string) {
    return this.notificacionesService.obtenerNoLeidas(id_estudiante);
  }

  @Get('estudiante/:id_estudiante/contador')
  async contarNoLeidas(@Param('id_estudiante') id_estudiante: string) {
    const count = await this.notificacionesService.contarNoLeidas(id_estudiante);
    return { count };
  }

  @Patch(':id/leer')
  async marcarComoLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarComoLeida(id);
  }

  @Patch('estudiante/:id_estudiante/leer-todas')
  async marcarTodasComoLeidas(@Param('id_estudiante') id_estudiante: string) {
    return this.notificacionesService.marcarTodasComoLeidas(id_estudiante);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.notificacionesService.eliminar(id);
  }
}
