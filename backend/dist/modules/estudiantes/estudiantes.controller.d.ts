import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudiantesController {
    private readonly estudiantesService;
    constructor(estudiantesService: EstudiantesService);
    findAll(search?: string): Promise<import("../../entities/estudiante.entity").Estudiante[]>;
    findOne(id: string): Promise<import("../../entities/estudiante.entity").Estudiante>;
    create(createEstudianteDto: CreateEstudianteDto): Promise<import("../../entities/estudiante.entity").Estudiante>;
    update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<import("../../entities/estudiante.entity").Estudiante>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
