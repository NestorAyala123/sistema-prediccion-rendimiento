import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrediccionesService } from './predicciones.service';

@Controller('predicciones')
export class PrediccionesController {
  constructor(private readonly prediccionesService: PrediccionesService) {}

  @Get()
  async findAll() {
    return this.prediccionesService.findAll();
  }

  @Get('estudiante/:id_estudiante')
  async findByEstudiante(@Param('id_estudiante') id_estudiante: string) {
    return this.prediccionesService.findByEstudiante(id_estudiante);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prediccionesService.findOne(id);
  }

  @Post('generar')
  async generar(@Body() body: { id_estudiante: string; data?: any }) {
    return this.prediccionesService.crear(body.id_estudiante, body.data);
  }
}
