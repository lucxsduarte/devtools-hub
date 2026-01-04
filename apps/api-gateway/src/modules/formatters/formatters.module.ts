import { Module } from '@nestjs/common';
import { JsonFormatterService } from './services/json-formatter.service';
import { JsonComparatorService } from './services/json-comparator.service';
import { FormattersController } from './formatters.controller';

@Module({
  providers: [JsonFormatterService, JsonComparatorService],
  controllers: [FormattersController]
})
export class FormattersModule {}
