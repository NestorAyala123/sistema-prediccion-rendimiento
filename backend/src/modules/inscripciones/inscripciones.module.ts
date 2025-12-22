import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { Inscripcion, InscripcionSchema } from '../../schemas/inscripcion.schema';
import { Estudiante, EstudianteSchema } from '../../schemas/estudiante.schema';
import { Asignatura, AsignaturaSchema } from '../../schemas/asignatura.schema';
import { Calificacion, CalificacionSchema } from '../../schemas/calificacion.schema';
import { Asistencia, AsistenciaSchema } from '../../schemas/asistencia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Estudiante.name, schema: EstudianteSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
      { name: Calificacion.name, schema: CalificacionSchema },
      { name: Asistencia.name, schema: AsistenciaSchema },
    ])
  ],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
