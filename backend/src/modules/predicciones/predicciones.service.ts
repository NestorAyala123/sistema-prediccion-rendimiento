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
    private prediccionesRepository: Repository<PrediccionRiesgo>,
    @InjectRepository(Estudiante)
    private estudiantesRepository: Repository<Estudiante>,
  ) {}

  async findAll(): Promise<any[]> {
    const predicciones = await this.prediccionesRepository.find({
      relations: ['estudiante'],
      order: { fecha_prediccion: 'DESC' },
    });

    // Formatear respuesta para incluir nombres y apellidos del estudiante
    return predicciones.map(pred => ({
      id_prediccion: pred.id_prediccion,
      id_estudiante: pred.id_estudiante,
      nombres: pred.estudiante?.nombres || '',
      apellidos: pred.estudiante?.apellidos || '',
      fecha_prediccion: pred.fecha_prediccion,
      nivel_riesgo: pred.nivel_riesgo,
      factores_clave: pred.factores_clave,
      estado_prediccion: pred.estado_prediccion,
    }));
  }

  async findByEstudiante(id_estudiante: string): Promise<PrediccionRiesgo[]> {
    return this.prediccionesRepository.find({
      where: { id_estudiante },
      order: { fecha_prediccion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PrediccionRiesgo> {
    const prediccion = await this.prediccionesRepository.findOne({
      where: { id_prediccion: id },
      relations: ['estudiante'],
    });

    if (!prediccion) {
      throw new NotFoundException(`Predicción ${id} no encontrada`);
    }

    return prediccion;
  }

  async crear(id_estudiante: string, data?: any): Promise<any> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudiantesRepository.findOne({
      where: { id_estudiante },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante ${id_estudiante} no encontrado`);
    }

    // Generar predicción (aquí puedes agregar lógica más compleja)
    const prediccion = this.prediccionesRepository.create({
      id_prediccion: uuidv4(),
      id_estudiante,
      nivel_riesgo: data?.nivel_riesgo || this.calcularNivelRiesgo(data),
      factores_clave: data?.factores_clave || this.generarFactoresClave(data),
      estado_prediccion: 'Completado',
    });

    const prediccionGuardada = await this.prediccionesRepository.save(prediccion);

    // Devolver predicción con datos del estudiante para uso inmediato
    return {
      id_prediccion: prediccionGuardada.id_prediccion,
      id_estudiante: prediccionGuardada.id_estudiante,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      fecha_prediccion: prediccionGuardada.fecha_prediccion,
      nivel_riesgo: prediccionGuardada.nivel_riesgo,
      factores_clave: prediccionGuardada.factores_clave,
      estado_prediccion: prediccionGuardada.estado_prediccion,
    };
  }

  private calcularNivelRiesgo(data: any): string {
    // Lógica simple de cálculo de riesgo
    if (!data) return 'Medio';

    const notasPromedio = data.notas_promedio || 0;
    const asistencia = data.asistencia_porcentaje || 0;

    if (notasPromedio < 5 || asistencia < 60) return 'Alto';
    if (notasPromedio < 7 || asistencia < 80) return 'Medio';
    return 'Bajo';
  }

  private generarFactoresClave(data: any): string {
    if (!data) return 'Sin datos disponibles para análisis';

    const factores: string[] = [];

    if (data.notas_promedio < 5) {
      factores.push(`Notas bajas (${data.notas_promedio}/10)`);
    }
    if (data.asistencia_porcentaje < 70) {
      factores.push(`${100 - data.asistencia_porcentaje}% de inasistencia`);
    }
    if (data.horas_estudio_semana < 5) {
      factores.push('Pocas horas de estudio semanales');
    }
    if (data.entregas_tareas_porcentaje < 70) {
      factores.push('Bajo porcentaje de entregas');
    }

    if (factores.length === 0) {
      factores.push('Buen rendimiento general');
    }

    return factores.join(', ');
  }
}
