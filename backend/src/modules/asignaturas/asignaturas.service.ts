import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asignatura, AsignaturaDocument } from '../../schemas/asignatura.schema';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from './dto/asignatura.dto';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectModel(Asignatura.name)
    private asignaturasModel: Model<AsignaturaDocument>,
  ) {}

  async create(createAsignaturaDto: CreateAsignaturaDto): Promise<Asignatura> {
    // Verificar si ya existe
    const existente = await this.asignaturasModel
      .findOne({ id_asignatura: createAsignaturaDto.id_asignatura })
      .exec();

    if (existente) {
      throw new ConflictException('La asignatura ya existe');
    }

    const asignatura = new this.asignaturasModel(createAsignaturaDto);
    return await asignatura.save();
  }

  async findAll(): Promise<Asignatura[]> {
    return await this.asignaturasModel
      .find()
      .sort({ id_asignatura: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Asignatura> {
    const asignatura = await this.asignaturasModel
      .findOne({ id_asignatura: id })
      .exec();

    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    return asignatura;
  }

  async update(id: string, updateAsignaturaDto: UpdateAsignaturaDto): Promise<Asignatura> {
    const asignatura = await this.asignaturasModel
      .findOneAndUpdate(
        { id_asignatura: id },
        { $set: updateAsignaturaDto },
        { new: true }
      )
      .exec();

    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    return asignatura;
  }

  async remove(id: string): Promise<void> {
    const result = await this.asignaturasModel
      .findOneAndDelete({ id_asignatura: id })
      .exec();

    if (!result) {
      throw new NotFoundException('Asignatura no encontrada');
    }
  }
}
