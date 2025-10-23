import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrediccionRiesgo } from '../../entities/prediccion-riesgo.entity';
import { Estudiante } from '../../entities/estudiante.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrediccionesService {
  constructor(
    @InjectRepository(PrediccionRiesgo)
    private predRepo: Repository<PrediccionRiesgo>,
    @InjectRepository(Estudiante)
    private estRepo: Repository<Estudiante>
  ) {}

  async findAll(): Promise<PrediccionRiesgo[]> {
    return await this.predRepo.find({
      relations: ['estudiante'],
      order: { fecha_prediccion: 'DESC' },
    });
  }

  async generateForStudent(id_estudiante: string): Promise<PrediccionRiesgo> {
    const estudiante = await this.estRepo.findOne({ where: { id_estudiante } });
    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`
      );
    }

    // Calcular nivel de riesgo basado en promedio_notas y porcentaje_asistencia
    let nivel_riesgo = 'Medio'; // Por defecto
    let factores_clave = '';
    const factores: string[] = [];

    // Análisis del promedio de notas
    if (
      estudiante.promedio_notas !== null &&
      estudiante.promedio_notas !== undefined
    ) {
      if (estudiante.promedio_notas >= 80) {
        factores.push(
          'Desempeño académico excelente (Notas: ' +
            estudiante.promedio_notas +
            '%)'
        );
      } else if (estudiante.promedio_notas >= 70) {
        factores.push(
          'Desempeño académico bueno (Notas: ' +
            estudiante.promedio_notas +
            '%)'
        );
      } else if (estudiante.promedio_notas >= 60) {
        factores.push(
          'Desempeño académico aceptable (Notas: ' +
            estudiante.promedio_notas +
            '%)'
        );
      } else if (estudiante.promedio_notas >= 50) {
        factores.push(
          'Desempeño académico deficiente (Notas: ' +
            estudiante.promedio_notas +
            '%)'
        );
      } else {
        factores.push(
          'Desempeño académico crítico (Notas: ' +
            estudiante.promedio_notas +
            '%)'
        );
      }
    }

    // Análisis de asistencia
    if (
      estudiante.porcentaje_asistencia !== null &&
      estudiante.porcentaje_asistencia !== undefined
    ) {
      if (estudiante.porcentaje_asistencia >= 90) {
        factores.push(
          'Asistencia excelente (' + estudiante.porcentaje_asistencia + '%)'
        );
      } else if (estudiante.porcentaje_asistencia >= 80) {
        factores.push(
          'Asistencia buena (' + estudiante.porcentaje_asistencia + '%)'
        );
      } else if (estudiante.porcentaje_asistencia >= 70) {
        factores.push(
          'Asistencia aceptable (' + estudiante.porcentaje_asistencia + '%)'
        );
      } else if (estudiante.porcentaje_asistencia >= 60) {
        factores.push(
          'Asistencia baja (' + estudiante.porcentaje_asistencia + '%)'
        );
      } else {
        factores.push(
          'Asistencia muy baja (' + estudiante.porcentaje_asistencia + '%)'
        );
      }
    }

    // Determinar nivel de riesgo
    if (
      estudiante.promedio_notas !== null &&
      estudiante.promedio_notas !== undefined &&
      estudiante.porcentaje_asistencia !== null &&
      estudiante.porcentaje_asistencia !== undefined
    ) {
      const promedio = estudiante.promedio_notas;
      const asistencia = estudiante.porcentaje_asistencia;

      // Scoring: bajo promedio o baja asistencia = alto riesgo
      if (promedio < 50 || asistencia < 60) {
        nivel_riesgo = 'Alto';
      } else if (promedio < 60 || asistencia < 70) {
        nivel_riesgo = 'Medio';
      } else if (promedio >= 80 && asistencia >= 90) {
        nivel_riesgo = 'Bajo';
      } else if (promedio >= 70 && asistencia >= 80) {
        nivel_riesgo = 'Bajo';
      } else {
        nivel_riesgo = 'Medio';
      }
    }

    factores_clave =
      factores.length > 0 ? factores.join('; ') : 'Sin datos suficientes';

    const nueva: Partial<PrediccionRiesgo> = {
      id_prediccion: uuidv4(),
      id_estudiante,
      nivel_riesgo,
      factores_clave,
      estado_prediccion: 'Completado',
    };

    const created = this.predRepo.create(nueva);
    return await this.predRepo.save(created);
  }

  async getReportPdf(id_prediccion: string): Promise<Buffer | null> {
    const pred = await this.predRepo.findOne({
      where: { id_prediccion },
      relations: ['estudiante'],
    });
    if (!pred) return null;

    // Crear PDF simple como placeholder: aquí devolvemos un Buffer con texto en PDF mínimo
    const content = `Reporte de Predicción\nID: ${pred.id_prediccion}\nEstudiante: ${pred.estudiante?.nombres || ''} ${pred.estudiante?.apellidos || ''}\nNivel de riesgo: ${pred.nivel_riesgo}\nFactores: ${pred.factores_clave}`;
    // PDF real requiere una librería; devolvemos un texto plano en buffer con header PDF simulado
    const buffer = Buffer.from(content, 'utf-8');
    return buffer;
  }

  async delete(id_prediccion: string): Promise<void> {
    const prediccion = await this.predRepo.findOne({
      where: { id_prediccion },
    });
    if (!prediccion) {
      throw new NotFoundException(
        `Predicción con ID ${id_prediccion} no encontrada`
      );
    }
    await this.predRepo.remove(prediccion);
  }
}
