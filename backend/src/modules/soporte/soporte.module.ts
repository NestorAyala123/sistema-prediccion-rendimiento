import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Soporte, SoporteSchema } from '../../schemas/soporte.schema';
import { SoporteService } from './soporte.service';
import { SoporteController } from './soporte.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Soporte.name, schema: SoporteSchema }])],
  providers: [SoporteService],
  controllers: [SoporteController],
  exports: [SoporteService],
})
export class SoporteModule {}
