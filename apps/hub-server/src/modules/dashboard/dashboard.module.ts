import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [HttpModule, CacheModule.register()],
})
export class DashboardModule {}
