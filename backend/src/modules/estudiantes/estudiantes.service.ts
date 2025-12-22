import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Estudiante, EstudianteDocument } from '../../schemas/estudiante.schema';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectModel(Estudiante.name)
    private estudiantesModel: Model<EstudianteDocument>,
  ) {}

  async findAll(): Promise<Estudiante[]> {
    return await this.estudiantesModel
      .find()
      .sort({ apellidos: 1, nombres: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Estudiante> {
    const estudiante = await this.estudiantesModel
      .findOne({ id_estudiante: id })
      .exec();

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return estudiante;
  }

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const estudiante = new this.estudiantesModel(createEstudianteDto);
    return await estudiante.save();
  }

  async update(
    id: string,
    updateEstudianteDto: UpdateEstudianteDto,
  ): Promise<Estudiante> {
    const estudiante = await this.estudiantesModel
      .findOneAndUpdate(
        { id_estudiante: id },
        { $set: updateEstudianteDto },
        { new: true }
      )
      .exec();

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return estudiante;
  }

  async remove(id: string): Promise<void> {
    const result = await this.estudiantesModel
      .findOneAndDelete({ id_estudiante: id })
      .exec();

    if (!result) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
  }

  async search(term: string): Promise<Estudiante[]> {
    const regex = new RegExp(term, 'i');
    return await this.estudiantesModel
      .find({
        $or: [
          { nombres: regex },
          { apellidos: regex },
          { email: regex },
          { id_estudiante: regex },
        ],
      })
      .sort({ apellidos: 1, nombres: 1 })
      .exec();
  }
}
