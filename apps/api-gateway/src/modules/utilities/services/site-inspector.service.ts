import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { config } from 'rxjs';

@Injectable()
export class SiteInspectorService {
  private redisClient: Redis;

  constructor(
    @Inject('CORE_WORKER_SERVICE') private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async inspect(url: string, clientSocketId?: string) {
    const trackingId = clientSocketId || `Guest_${randomUUID()}`;

    const cacheKey = `site-cache:${url}`;

    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Cache Hit! Retornando dados imediatos para ${url}`);
      return {
        status: 'completed',
        message: 'Análise recuperada do cache com sucesso.',
        data: JSON.parse(cachedData),
        fromCache: true,
      };
    }

    console.log(`Cache Miss. Enviando ${url} para o Worker Java...`);

    const payload = {
      url: url,
      socketId: trackingId,
      timestamp: new Date().toISOString(),
    };

    this.client.emit('', payload);

    return {
      status: 'accepted',
      message: 'Solicitação enviada para fila de processamento.',
      details: {
        targetUrl: url,
        trackingId: trackingId,
      },
    };
  }
}
