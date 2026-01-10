import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrediccionesService } from './predicciones.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('predicciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrediccionesController {
  constructor(private readonly prediccionesService: PrediccionesService) {}

  @Get()
  @Roles('administrador', 'docente')
  async findAll() {
    return this.prediccionesService.findAll();
  }

  @Get('estudiante/:id_estudiante')
  @Roles('administrador', 'docente', 'estudiante')
  async findByEstudiante(@Param('id_estudiante') id_estudiante: string) {
    return this.prediccionesService.findByEstudiante(id_estudiante);
  }

  @Get(':id')
  @Roles('administrador', 'docente', 'estudiante')
  async findOne(@Param('id') id: string) {
    return this.prediccionesService.findOne(id);
  }

  @Post('generar')
  @Roles('administrador', 'docente')
  async generar(@Body() body: { id_estudiante: string; data?: any }) {
    return this.prediccionesService.crear(body.id_estudiante, body.data);
  }
}
