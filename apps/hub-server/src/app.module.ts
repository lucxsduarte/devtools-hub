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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    GeneratorsModule,
    ConvertersModule,
    FormattersModule,
    CoreModule,
    UtilitiesModule,
    EventsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
