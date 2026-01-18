import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GeneratorsModule } from './modules/generators/generators.module';
import { ConvertersModule } from './modules/converters/converters.module';
import { FormattersModule } from './modules/formatters/formatters.module';
import { CoreModule } from './modules/core/core.module';
import { UtilitiesModule } from './modules/utilities/utilities.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    GeneratorsModule,
    ConvertersModule,
    FormattersModule,
    CoreModule,
    UtilitiesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
