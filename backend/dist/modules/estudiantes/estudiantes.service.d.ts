import { Model } from 'mongoose';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudiantesService {
    private estudiantesModel;
    constructor(estudiantesModel: Model<EstudianteDocument>);
    findAll(): Promise<Estudiante[]>;
    findOne(id: string): Promise<Estudiante>;
    create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante>;
    update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante>;
    remove(id: string): Promise<void>;
    search(term: string): Promise<Estudiante[]>;
}
