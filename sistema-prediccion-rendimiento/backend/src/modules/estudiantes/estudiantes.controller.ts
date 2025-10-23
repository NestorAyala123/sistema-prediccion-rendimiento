import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) {
      return await this.estudiantesService.search(search);
    }
    return await this.estudiantesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.estudiantesService.findOne(id);
  }

  @Post()
  async create(@Body() createEstudianteDto: CreateEstudianteDto) {
    try {
      console.log('Datos recibidos:', createEstudianteDto);
      return await this.estudiantesService.create(createEstudianteDto);
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto
  ) {
    return await this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.estudiantesService.remove(id);
    return { message: 'Estudiante eliminado exitosamente' };
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csvBuffer = await this.estudiantesService.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=estudiantes-${new Date().toISOString().split('T')[0]}.csv`
    );
    return res.send(csvBuffer);
  }
}
