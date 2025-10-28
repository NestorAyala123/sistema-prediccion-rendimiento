import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { AuthModule } from './auth/auth.module';
import { SoporteModule } from './modules/soporte/soporte.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    EstudiantesModule,
  SoporteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
