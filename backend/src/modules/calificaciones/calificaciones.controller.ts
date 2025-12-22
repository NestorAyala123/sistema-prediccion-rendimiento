import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto, CreateCalificacionPorPeriodoDto, UpdateCalificacionDto } from './dto/calificacion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('calificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  // Crear calificación (método tradicional por inscripción)
  @Post()
  @Roles('administrador', 'docente')
  async create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return await this.calificacionesService.create(createCalificacionDto);
  }

  // Crear calificación por periodo y materia (método simplificado)
  @Post('por-periodo')
  @Roles('administrador', 'docente')
  async createPorPeriodo(@Body() dto: CreateCalificacionPorPeriodoDto) {
    return await this.calificacionesService.createPorPeriodo(dto);
  }

  // Obtener todas las calificaciones
  @Get()
  @Roles('administrador', 'docente')
  async findAll() {
    return await this.calificacionesService.findAll();
  }

  // Obtener calificaciones de un estudiante
  @Get('estudiante/:id')
  @Roles('administrador', 'docente', 'estudiante')
  async findByEstudiante(@Param('id') id: string) {
    return await this.calificacionesService.findByEstudiante(id);
  }

  // Obtener calificaciones por periodo académico
  @Get('periodo/:periodo')
  @Roles('administrador', 'docente')
  async findByPeriodo(@Param('periodo') periodo: string) {
    return await this.calificacionesService.findByPeriodo(periodo);
  }

  // Obtener calificaciones por asignatura y periodo
  @Get('asignatura/:id_asignatura/periodo/:periodo')
  @Roles('administrador', 'docente')
  async findByAsignaturaYPeriodo(
    @Param('id_asignatura') id_asignatura: string,
    @Param('periodo') periodo: string,
  ) {
    return await this.calificacionesService.findByAsignaturaYPeriodo(id_asignatura, periodo);
  }

  // Obtener promedio de estudiante en un periodo
  @Get('promedio/estudiante/:id/periodo/:periodo')
  @Roles('administrador', 'docente', 'estudiante')
  async getPromedioEstudiantePeriodo(
    @Param('id') id: string,
    @Param('periodo') periodo: string,
  ) {
    const promedio = await this.calificacionesService.getPromedioEstudiantePeriodo(id, periodo);
    return { promedio };
  }

  // Obtener una calificación específica
  @Get(':id')
  @Roles('administrador', 'docente', 'estudiante')
  async findOne(@Param('id') id: string) {
    return await this.calificacionesService.findOne(id);
  }

  // Actualizar calificación
  @Put(':id')
  @Roles('administrador', 'docente')
  async update(@Param('id') id: string, @Body() updateCalificacionDto: UpdateCalificacionDto) {
    return await this.calificacionesService.update(id, updateCalificacionDto);
  }

  // Eliminar calificación
  @Delete(':id')
  @Roles('administrador', 'docente')
  async remove(@Param('id') id: string) {
    await this.calificacionesService.remove(id);
    return { message: 'Calificación eliminada exitosamente' };
  }
}
