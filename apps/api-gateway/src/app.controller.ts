import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(
        @Inject('CORE_WORKER_SERVICE') private readonly client: ClientProxy,
    ) {
    }

    @Get('ping-rabbit')
    async testeRabbit() {
        // Envia uma mensagem para a fila e espera (se fosse request/response)
        // Como é só teste de envio, vamos usar emit (fire-and-forget)
        this.client.emit('test-pattern', {text: 'Olá do NestJS para o RabbitMQ!'});
        return 'Mensagem enviada para o RabbitMQ! Verifique o painel do RabbitMQ.';
    }
}