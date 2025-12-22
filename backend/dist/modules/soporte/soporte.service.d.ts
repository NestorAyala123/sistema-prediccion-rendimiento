import { Model } from 'mongoose';
import { Soporte, SoporteDocument } from '../../schemas/soporte.schema';
import { CreateSoporteDto } from './dto/create-soporte.dto';
export declare class SoporteService {
    private readonly soporteModel;
    constructor(soporteModel: Model<SoporteDocument>);
    create(dto: CreateSoporteDto): Promise<Soporte>;
    findAll(): Promise<Soporte[]>;
}
