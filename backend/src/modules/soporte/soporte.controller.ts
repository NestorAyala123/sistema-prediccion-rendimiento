import { Controller, Post, Body, Get } from '@nestjs/common';
import { SoporteService } from './soporte.service';
import { CreateSoporteDto } from './dto/create-soporte.dto';

@Controller('soporte')
export class SoporteController {
  constructor(private readonly soporteService: SoporteService) {}

  @Post()
  async create(@Body() dto: CreateSoporteDto) {
    const created = await this.soporteService.create(dto);
    return { success: true, data: created };
  }

  @Get()
  async findAll() {
    const list = await this.soporteService.findAll();
    return { success: true, data: list };
  }
}
