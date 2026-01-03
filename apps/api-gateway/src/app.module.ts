import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
            {
                name: 'CORE_WORKER_SERVICE', // Nome que usaremos para chamar o Java
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
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
