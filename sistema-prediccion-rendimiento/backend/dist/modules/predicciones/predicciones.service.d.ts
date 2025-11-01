import { Repository } from 'typeorm';
import { PrediccionRiesgo } from '../../entities/prediccion-riesgo.entity';
import { Estudiante } from '../../entities/estudiante.entity';
export declare class PrediccionesService {
    private predRepo;
    private estRepo;
    constructor(predRepo: Repository<PrediccionRiesgo>, estRepo: Repository<Estudiante>);
    findAll(): Promise<PrediccionRiesgo[]>;
    generateForStudent(id_estudiante: string): Promise<PrediccionRiesgo>;
    getReportPdf(id_prediccion: string): Promise<Buffer | null>;
    delete(id_prediccion: string): Promise<void>;
}
