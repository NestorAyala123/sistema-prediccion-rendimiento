import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto, UpdateInscripcionDto } from './dto/inscripcion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('inscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  // Crear inscripción
  @Post()
  @Roles('administrador', 'docente')
  async create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return await this.inscripcionesService.create(createInscripcionDto);
  }

  // Obtener todas las inscripciones
  @Get()
  @Roles('administrador', 'docente')
  async findAll() {
    return await this.inscripcionesService.findAll();
  }

  // Obtener inscripciones de un estudiante
  @Get('estudiante/:id')
  @Roles('administrador', 'docente', 'estudiante')
  async findByEstudiante(@Param('id') id: string) {
    return await this.inscripcionesService.findByEstudiante(id);
  }

  // Obtener inscripciones por periodo académico
  @Get('periodo/:periodo')
  @Roles('administrador', 'docente')
  async findByPeriodo(@Param('periodo') periodo: string) {
    return await this.inscripcionesService.findByPeriodo(periodo);
  }

  // Obtener inscripciones por asignatura
  @Get('asignatura/:id')
  @Roles('administrador', 'docente')
  async findByAsignatura(@Param('id') id: string) {
    return await this.inscripcionesService.findByAsignatura(id);
  }

  // Obtener inscripciones por asignatura y periodo
  @Get('asignatura/:id_asignatura/periodo/:periodo')
  @Roles('administrador', 'docente')
  async findByAsignaturaYPeriodo(
    @Param('id_asignatura') id_asignatura: string,
    @Param('periodo') periodo: string,
  ) {
    return await this.inscripcionesService.findByAsignaturaYPeriodo(id_asignatura, periodo);
  }

  // Obtener estadísticas de inscripciones por periodo
  @Get('estadisticas/periodo/:periodo')
  @Roles('administrador', 'docente')
  async getEstadisticasPorPeriodo(@Param('periodo') periodo: string) {
    return await this.inscripcionesService.getEstadisticasPorPeriodo(periodo);
  }

  // Obtener una inscripción específica
  @Get(':id')
  @Roles('administrador', 'docente', 'estudiante')
  async findOne(@Param('id') id: string) {
    return await this.inscripcionesService.findOne(id);
  }

  // Actualizar inscripción
  @Put(':id')
  @Roles('administrador', 'docente')
  async update(@Param('id') id: string, @Body() updateInscripcionDto: UpdateInscripcionDto) {
    return await this.inscripcionesService.update(id, updateInscripcionDto);
  }

  // Eliminar inscripción
  @Delete(':id')
  @Roles('administrador')
  async remove(@Param('id') id: string) {
    await this.inscripcionesService.remove(id);
    return { message: 'Inscripción eliminada exitosamente' };
  }
}
