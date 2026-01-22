import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [HttpModule],
})
export class DashboardModule {}
