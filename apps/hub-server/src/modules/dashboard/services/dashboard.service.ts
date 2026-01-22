import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getQuote() {
    const cacheKey = 'hour_quote';

    const cachedQuote = await this.cacheManager.get(cacheKey);
    if (cachedQuote) {
      return cachedQuote;
    }

    const url = 'https://dummyjson.com/quotes/random';
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));

      const quote = {
        content: data.quote,
        author: data.author,
      };

      await this.cacheManager.set(cacheKey, quote, 1000 * 60 * 60);

      return quote;
    } catch (error) {
      this.logger.warn('Erro API Frases, usando fallback');
      return {
        content: 'First, solve the problem. Then, write the code.',
        author: 'John Johnson',
      };
    }
  }

  async getWeather(lat: string, lon: string) {
    const cacheKey = `weather_${lat}_${lon}`;

    const cachedWeather = await this.cacheManager.get(cacheKey);
    if (cachedWeather) {
      return cachedWeather;
    }

    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    const baseURl = this.configService.get<string>('OPENWEATHER_BASE_URL');
    const weatherUrl = `${baseURl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
    const geoUrl = `${baseURl}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

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

      await this.cacheManager.set(cacheKey, weatherData, 1000 * 60 * 10);

      return weatherData;
    } catch (error) {
      this.logger.error(`Erro clima: ${error.message}`);
      throw error;
    }
  }

  async getQuotes() {
    const cacheKey = 'finance_data';

    const cachedFinance = await this.cacheManager.get(cacheKey);
    if (cachedFinance) {
      return cachedFinance;
    }

    const url =
      'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL';
    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      await this.cacheManager.set(cacheKey, data, 1000 * 60);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
