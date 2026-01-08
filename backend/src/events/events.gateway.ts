import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('🚀 WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`✅ Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Cliente desconectado: ${client.id}`);
  }

  // Emitir evento cuando se crea/actualiza una calificación
  emitCalificacionCreada(calificacion: any) {
    this.server.emit('calificacion:created', calificacion);
    this.logger.log('📝 Calificación creada - evento emitido');
  }

  emitCalificacionActualizada(calificacion: any) {
    this.server.emit('calificacion:updated', calificacion);
    this.logger.log('✏️ Calificación actualizada - evento emitido');
  }

  // Emitir evento cuando se crea/actualiza una asistencia
  emitAsistenciaCreada(asistencia: any) {
    this.server.emit('asistencia:created', asistencia);
    this.logger.log('✔️ Asistencia creada - evento emitido');
  }

  emitAsistenciaActualizada(asistencia: any) {
    this.server.emit('asistencia:updated', asistencia);
    this.logger.log('✏️ Asistencia actualizada - evento emitido');
  }

  // Emitir evento cuando se crea una predicción
  emitPrediccionCreada(prediccion: any) {
    this.server.emit('prediccion:created', prediccion);
    this.logger.log('🔮 Predicción creada - evento emitido');
  }

  // Emitir evento cuando se registra asistencia en lote
  emitAsistenciaLote(data: any) {
    this.server.emit('asistencia:lote', data);
    this.logger.log('📊 Asistencia en lote - evento emitido');
  }

  // Método genérico para emitir cualquier evento
  emitEvent(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`📡 Evento emitido: ${event}`);
  }

  // Emitir notificación general
  emitNotification(notification: {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    userId?: string;
  }) {
    if (notification.userId) {
      // Enviar a un usuario específico (si implementas rooms por usuario)
      this.server.to(notification.userId).emit('notification', notification);
    } else {
      // Enviar a todos
      this.server.emit('notification', notification);
    }
    this.logger.log(`🔔 Notificación emitida: ${notification.message}`);
  }
}
