import { SoporteService } from './soporte.service';
import { CreateSoporteDto } from './dto/create-soporte.dto';
export declare class SoporteController {
    private readonly soporteService;
    constructor(soporteService: SoporteService);
    create(dto: CreateSoporteDto): Promise<{
        success: boolean;
        data: import("../../schemas/soporte.schema").Soporte;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("../../schemas/soporte.schema").Soporte[];
    }>;
}
