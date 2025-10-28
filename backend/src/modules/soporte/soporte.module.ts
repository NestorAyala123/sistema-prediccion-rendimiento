import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Soporte } from '../../entities/soporte.entity';
import { SoporteService } from './soporte.service';
import { SoporteController } from './soporte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Soporte])],
  providers: [SoporteService],
  controllers: [SoporteController],
  exports: [SoporteService],
})
export class SoporteModule {}
