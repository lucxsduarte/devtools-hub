import {Module} from '@nestjs/common';
import {EventsGateway} from './events.gateway';
import {EventsService} from './events.service';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [EventsGateway, EventsService],
    exports: [EventsGateway],
})
export class EventsModule {
}
