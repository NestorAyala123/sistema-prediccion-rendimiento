import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Sistema de Predicción de Rendimiento Académico - Backend API';
  }
}

