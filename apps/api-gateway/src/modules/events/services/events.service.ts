import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EventsGateway } from '../events.gateway';

@Injectable()
export class EventsService implements OnModuleInit {
  private redisSubscriber: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  onModuleInit() {
    this.redisSubscriber = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });

    this.redisSubscriber.subscribe('analysis_results', (err) => {
      if (err) {
        console.error('Erro ao se inscrever no Redis:', err);
      } else {
        console.log('Ouvindo canal "analysis_results" no Redis...');
      }
    });

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'analysis_results') {
        this.processMessage(message);
      }
    });
  }

  private processMessage(rawMessage: string) {
    try {
      const payload = JSON.parse(rawMessage);

      const { socketId, data } = payload;

      if (socketId && data) {
        console.log(`Enviando resultado via WebSocket para: ${socketId}`);
        this.eventsGateway.sendToUser(socketId, 'analysis_complete', data);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem do Redis:', error);
    }
  }
}
