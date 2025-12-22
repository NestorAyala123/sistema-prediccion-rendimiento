import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from './dto/asignatura.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('asignaturas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Post()
  @Roles('administrador')
  async create(@Body() createAsignaturaDto: CreateAsignaturaDto) {
    return await this.asignaturasService.create(createAsignaturaDto);
  }

  @Get()
  @Roles('administrador', 'docente', 'estudiante')
  async findAll() {
    return await this.asignaturasService.findAll();
  }

  @Get(':id')
  @Roles('administrador', 'docente', 'estudiante')
  async findOne(@Param('id') id: string) {
    return await this.asignaturasService.findOne(id);
  }

  @Put(':id')
  @Roles('administrador')
  async update(@Param('id') id: string, @Body() updateAsignaturaDto: UpdateAsignaturaDto) {
    return await this.asignaturasService.update(id, updateAsignaturaDto);
  }

  @Delete(':id')
  @Roles('administrador')
  async remove(@Param('id') id: string) {
    await this.asignaturasService.remove(id);
    return { message: 'Asignatura eliminada exitosamente' };
  }
}
