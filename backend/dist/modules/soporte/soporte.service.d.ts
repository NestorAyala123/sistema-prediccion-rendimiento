import { Repository } from 'typeorm';
import { Soporte } from '../../entities/soporte.entity';
import { CreateSoporteDto } from './dto/create-soporte.dto';
export declare class SoporteService {
    private readonly soporteRepo;
    constructor(soporteRepo: Repository<Soporte>);
    create(dto: CreateSoporteDto): Promise<Soporte>;
    findAll(): Promise<Soporte[]>;
}
