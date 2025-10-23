import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { PrediccionesModule } from './modules/predicciones/predicciones.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    EstudiantesModule,
    PrediccionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
