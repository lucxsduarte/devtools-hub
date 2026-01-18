import {Module} from '@nestjs/common';
import {SiteInspectorService} from './services/site-inspector.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {UtilitiesController} from "./utilities.controller";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'CORE_WORKER_SERVICE', // Nome que usaremos para chamar o Java
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_HOST', 'localhost')}:${configService.get('RABBITMQ_PORT_AMQP', '5672')}`,
                        ],
                        queue: 'core_queue', // Nome da fila que o Java vai escutar
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    controllers: [UtilitiesController],
    providers: [SiteInspectorService]
})
export class UtilitiesModule {
}
