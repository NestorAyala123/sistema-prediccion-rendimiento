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
    private estudiantesRepository: Repository<Estudiante>,
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
    updateEstudianteDto: UpdateEstudianteDto,
  ): Promise<Estudiante> {
    const estudiante = await this.findOne(id);
    Object.assign(estudiante, updateEstudianteDto);
    return await this.estudiantesRepository.save(estudiante);
  }

  async remove(id: string): Promise<void> {
    const estudiante = await this.findOne(id);
    await this.estudiantesRepository.remove(estudiante);
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
}
