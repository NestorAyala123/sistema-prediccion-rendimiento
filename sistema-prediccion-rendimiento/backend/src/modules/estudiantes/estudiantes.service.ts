import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../../entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private estudiantesRepository: Repository<Estudiante>
  ) {}

  async findAll(): Promise<Estudiante[]> {
    return await this.estudiantesRepository.find({
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Estudiante> {
    const estudiante = await this.estudiantesRepository.findOne({
      where: { id_estudiante: id },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return estudiante;
  }

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const estudiante = this.estudiantesRepository.create(createEstudianteDto);
    return await this.estudiantesRepository.save(estudiante);
  }

  async update(
    id: string,
    updateEstudianteDto: UpdateEstudianteDto
  ): Promise<Estudiante> {
    const estudiante = await this.findOne(id);
    Object.assign(estudiante, updateEstudianteDto);
    return await this.estudiantesRepository.save(estudiante);
  }

  async remove(id: string): Promise<void> {
    const estudiante = await this.findOne(id);

    // Eliminar en cascada: predicciones, inscripciones, hábitos de estudio
    // Esto es importante para evitar violaciones de clave foránea
    try {
      await this.estudiantesRepository.remove(estudiante);
    } catch (error) {
      // Si hay error de clave foránea, intentar eliminar registros relacionados
      console.error('Error al eliminar estudiante:', error);
      throw new Error(
        `No se puede eliminar el estudiante. Puede estar relacionado con otros datos.`
      );
    }
  }

  async search(term: string): Promise<Estudiante[]> {
    return await this.estudiantesRepository
      .createQueryBuilder('estudiante')
      .where('estudiante.nombres LIKE :term', { term: `%${term}%` })
      .orWhere('estudiante.apellidos LIKE :term', { term: `%${term}%` })
      .orWhere('estudiante.email LIKE :term', { term: `%${term}%` })
      .orWhere('estudiante.id_estudiante LIKE :term', { term: `%${term}%` })
      .orderBy('estudiante.apellidos', 'ASC')
      .addOrderBy('estudiante.nombres', 'ASC')
      .getMany();
  }

  async exportCSV(): Promise<Buffer> {
    const estudiantes = await this.findAll();
    const header = [
      'id_estudiante',
      'nombres',
      'apellidos',
      'email',
      'semestre_actual',
      'created_at',
    ];
    const rows = estudiantes.map((e) => [
      e.id_estudiante,
      e.nombres,
      e.apellidos,
      e.email,
      e.semestre_actual?.toString() || '',
      e.created_at ? new Date(e.created_at).toISOString() : '',
    ]);

    const csv = [
      header.join(','),
      ...rows.map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    return Buffer.from(csv, 'utf-8');
  }
}
