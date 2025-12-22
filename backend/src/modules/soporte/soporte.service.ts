import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Soporte, SoporteDocument } from '../../schemas/soporte.schema';
import { CreateSoporteDto } from './dto/create-soporte.dto';

@Injectable()
export class SoporteService {
  constructor(
    @InjectModel(Soporte.name)
    private readonly soporteModel: Model<SoporteDocument>,
  ) {}

  async create(dto: CreateSoporteDto): Promise<Soporte> {
    const soporte = new this.soporteModel(dto);
    return await soporte.save();
  }

  async findAll(): Promise<Soporte[]> {
    return this.soporteModel.find().sort({ created_at: -1 }).exec();
  }
}
