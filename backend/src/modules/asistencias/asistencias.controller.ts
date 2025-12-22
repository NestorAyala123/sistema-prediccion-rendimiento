import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto, UpdateAsistenciaDto } from './dto/asistencia.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  // Crear asistencia
  @Post()
  @Roles('administrador', 'docente')
  async create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return await this.asistenciasService.create(createAsistenciaDto);
  }

  // Obtener todas las asistencias
  @Get()
  @Roles('administrador', 'docente')
  async findAll() {
    return await this.asistenciasService.findAll();
  }

  // Obtener asistencias de un estudiante
  @Get('estudiante/:id')
  @Roles('administrador', 'docente', 'estudiante')
  async findByEstudiante(@Param('id') id: string) {
    return await this.asistenciasService.findByEstudiante(id);
  }

  // Obtener asistencias por inscripción
  @Get('inscripcion/:id')
  @Roles('administrador', 'docente', 'estudiante')
  async findByInscripcion(@Param('id') id: string) {
    return await this.asistenciasService.findByInscripcion(id);
  }

  // Obtener asistencias por fecha
  @Get('fecha/:fecha')
  @Roles('administrador', 'docente')
  async findByFecha(@Param('fecha') fecha: string) {
    const fechaObj = new Date(fecha);
    return await this.asistenciasService.findByFecha(fechaObj);
  }

  // Obtener asistencias por rango de fechas
  @Get('rango')
  @Roles('administrador', 'docente')
  async findByRangoFechas(
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string,
  ) {
    const fechaInicioObj = new Date(fecha_inicio);
    const fechaFinObj = new Date(fecha_fin);
    return await this.asistenciasService.findByRangoFechas(fechaInicioObj, fechaFinObj);
  }

  // Obtener estadísticas de asistencia por asignatura y periodo
  @Get('estadisticas/asignatura/:id_asignatura/periodo/:periodo')
  @Roles('administrador', 'docente')
  async getEstadisticasPorAsignaturaYPeriodo(
    @Param('id_asignatura') id_asignatura: string,
    @Param('periodo') periodo: string,
  ) {
    return await this.asistenciasService.getEstadisticasPorAsignaturaYPeriodo(id_asignatura, periodo);
  }

  // Obtener una asistencia específica
  @Get(':id')
  @Roles('administrador', 'docente', 'estudiante')
  async findOne(@Param('id') id: string) {
    return await this.asistenciasService.findOne(id);
  }

  // Actualizar asistencia
  @Put(':id')
  @Roles('administrador', 'docente')
  async update(@Param('id') id: string, @Body() updateAsistenciaDto: UpdateAsistenciaDto) {
    return await this.asistenciasService.update(id, updateAsistenciaDto);
  }

  // Eliminar asistencia
  @Delete(':id')
  @Roles('administrador', 'docente')
  async remove(@Param('id') id: string) {
    await this.asistenciasService.remove(id);
    return { message: 'Asistencia eliminada exitosamente' };
  }
}
