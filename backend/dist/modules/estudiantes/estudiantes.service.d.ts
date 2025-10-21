import { Repository } from 'typeorm';
import { Estudiante } from '../../entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudiantesService {
    private estudiantesRepository;
    constructor(estudiantesRepository: Repository<Estudiante>);
    findAll(): Promise<Estudiante[]>;
    findOne(id: string): Promise<Estudiante>;
    create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante>;
    update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante>;
    remove(id: string): Promise<void>;
    search(term: string): Promise<Estudiante[]>;
}
