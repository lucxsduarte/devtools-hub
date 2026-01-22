import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from '../../../commons/exceptions/business.exception';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getWeather(lat: string, lon: string) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      this.logger.error('API Key do OpenWeather não configurada no .env');
      throw new BusinessException('Configuração de servidor inválida');
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;

    const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    try {
      const [weatherResponse, geoResponse] = await Promise.all([
        firstValueFrom(this.httpService.get(weatherUrl)),
        firstValueFrom(this.httpService.get(geoUrl)),
      ]);

      const weatherData = weatherResponse.data;
      const geoData = geoResponse.data;

      if (geoData && geoData.length > 0) {
        weatherData.name = geoData[0].name;
      }

      return weatherData;
    } catch (error) {
      this.logger.error(`Erro ao buscar clima/geo: ${error.message}`);
      throw error;
    }
  }

  async getQuotes() {
    const url = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL';

    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      this.logger.error('Erro ao buscar cotações', error);
      throw error;
    }
  }

  async getQuote() {
    const url = 'https://dummyjson.com/quotes/random';

    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      return {
        content: data.quote,
        author: data.author,
      };
    } catch (error) {
      this.logger.warn('API de frases falhou, usando fallback');
      return {
        content: 'First, solve the problem. Then, write the code.',
        author: 'John Johnson',
      };
    }
  }
}
