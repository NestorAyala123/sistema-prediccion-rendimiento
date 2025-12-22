import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstudiantesController } from './/estudiantes.controller';
import { EstudiantesService } from './estudiantes.service';
import { Estudiante, EstudianteSchema } from '../../schemas/estudiante.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Estudiante.name, schema: EstudianteSchema }])],
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
