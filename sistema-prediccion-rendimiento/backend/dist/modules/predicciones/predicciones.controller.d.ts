import { PrediccionesService } from './predicciones.service';
import { Response } from 'express';
export declare class PrediccionesController {
    private readonly prediccionesService;
    constructor(prediccionesService: PrediccionesService);
    findAll(): Promise<import("../../entities/prediccion-riesgo.entity").PrediccionRiesgo[]>;
    generar(id_estudiante: string): Promise<import("../../entities/prediccion-riesgo.entity").PrediccionRiesgo>;
    getReporte(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(id: string): Promise<void>;
}
