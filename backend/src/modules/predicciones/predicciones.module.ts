import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrediccionesController } from './predicciones.controller';
import { PrediccionesService } from './predicciones.service';
import { PrediccionRiesgo, PrediccionRiesgoSchema } from '../../schemas/prediccion-riesgo.schema';
import { Estudiante, EstudianteSchema } from '../../schemas/estudiante.schema';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrediccionRiesgo.name, schema: PrediccionRiesgoSchema },
      { name: Estudiante.name, schema: EstudianteSchema },
    ]),
    NotificacionesModule,
  ],
  controllers: [PrediccionesController],
  providers: [PrediccionesService],
  exports: [PrediccionesService],
})
export class PrediccionesModule {}
