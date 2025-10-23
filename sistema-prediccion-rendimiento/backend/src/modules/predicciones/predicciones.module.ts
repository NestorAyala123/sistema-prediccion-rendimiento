import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrediccionesController } from './predicciones.controller';
import { PrediccionesService } from './predicciones.service';
import { PrediccionRiesgo } from '../../entities/prediccion-riesgo.entity';
import { Estudiante } from '../../entities/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrediccionRiesgo, Estudiante])],
  controllers: [PrediccionesController],
  providers: [PrediccionesService],
  exports: [PrediccionesService],
})
export class PrediccionesModule {}
