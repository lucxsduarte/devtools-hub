import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {randomUUID} from "node:crypto";

@Injectable()
export class SiteInspectorService {
    constructor(
        @Inject('CORE_WORKER_SERVICE') private readonly client: ClientProxy,
    ) {}

    inspect(url: string, clientSocketId?: string) {
        const trackingId = clientSocketId || `Guest_${randomUUID()}`;

        const payload = {
            url: url,
            socketId: trackingId,
            timestamp: new Date().toISOString(),
        };

        this.client.emit('', payload);

        return {
            status: 'accepted',
            message: 'Análise solicitada anonimamente.',
            details: {
                targetUrl: url,
                trackingId: trackingId,
            }
        };
    }
}