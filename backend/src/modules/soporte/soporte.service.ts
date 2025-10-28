import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Soporte } from '../../entities/soporte.entity';
import { CreateSoporteDto } from './dto/create-soporte.dto';

@Injectable()
export class SoporteService {
  constructor(
    @InjectRepository(Soporte)
    private readonly soporteRepo: Repository<Soporte>,
  ) {}

  async create(dto: CreateSoporteDto): Promise<Soporte> {
    const ent = this.soporteRepo.create(dto as unknown as Soporte);
    return this.soporteRepo.save(ent as Soporte);
  }

  async findAll(): Promise<Soporte[]> {
    return this.soporteRepo.find({ order: { created_at: 'DESC' } });
  }
}
