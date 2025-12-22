import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AsignaturasController } from './asignaturas.controller';
import { AsignaturasService } from './asignaturas.service';
import { Asignatura, AsignaturaSchema } from '../../schemas/asignatura.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Asignatura.name, schema: AsignaturaSchema }])],
  controllers: [AsignaturasController],
  providers: [AsignaturasService],
  exports: [AsignaturasService],
})
export class AsignaturasModule {}
