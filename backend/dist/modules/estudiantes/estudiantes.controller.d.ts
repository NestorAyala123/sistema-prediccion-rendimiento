import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
export declare class EstudiantesController {
    private readonly estudiantesService;
    constructor(estudiantesService: EstudiantesService);
    findAll(search?: string): Promise<import("../../schemas/estudiante.schema").Estudiante[]>;
    findOne(id: string): Promise<import("../../schemas/estudiante.schema").Estudiante>;
    create(createEstudianteDto: CreateEstudianteDto): Promise<import("../../schemas/estudiante.schema").Estudiante>;
    update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<import("../../schemas/estudiante.schema").Estudiante>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
