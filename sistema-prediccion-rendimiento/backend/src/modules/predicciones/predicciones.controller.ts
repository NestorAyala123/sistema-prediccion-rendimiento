import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PrediccionesService } from './predicciones.service';
import { Response } from 'express';

@Controller('predicciones')
export class PrediccionesController {
  constructor(private readonly prediccionesService: PrediccionesService) {}

  @Get()
  async findAll() {
    return await this.prediccionesService.findAll();
  }

  @Post('generar')
  async generar(@Body('id_estudiante') id_estudiante: string) {
    return await this.prediccionesService.generateForStudent(id_estudiante);
  }

  @Get(':id/reporte')
  async getReporte(@Param('id') id: string, @Res() res: Response) {
    // Generar o recuperar PDF (placeholder)
    const pdfBuffer = await this.prediccionesService.getReportPdf(id);
    if (!pdfBuffer) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Reporte no disponible' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-${id}.pdf`
    );
    return res.status(HttpStatus.OK).send(pdfBuffer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.prediccionesService.delete(id);
  }
}
