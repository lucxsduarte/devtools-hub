import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('weather')
  @ApiOperation({ summary: 'Busca o clima baseada na latitude e longitude' })
  getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    return this.dashboardService.getWeather(lat, lon);
  }

  @Get('finance')
  @ApiOperation({ summary: 'Busca cotações de moedas' })
  getFinance() {
    return this.dashboardService.getQuotes();
  }

  @Get('quote')
  @ApiOperation({ summary: 'Busca uma frase inspiradora de tecnologia' })
  getQuote() {
    return this.dashboardService.getQuote();
  }
}
