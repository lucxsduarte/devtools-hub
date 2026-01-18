import { Controller, Post, Body } from '@nestjs/common';
import { JsonFormatterService } from './services/json-formatter.service';
import { JsonComparatorService } from './services/json-comparator.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonCompareDto } from './dtos/formatter-inputs.dto';

@ApiTags('Formatters')
@Controller('formatters')
export class FormattersController {
  constructor(
    private readonly formatterService: JsonFormatterService,
    private readonly comparatorService: JsonComparatorService,
  ) {}

  @Post('json-format')
  @ApiOperation({ summary: 'Formata e indenta um JSON minificado' })
  @ApiConsumes('text/plain')
  @ApiBody({
    schema: { type: 'string', example: '{nome: "Teste", idade: 25 }' },
  })
  formatJson(@Body() rawBody: string) {
    if (!rawBody || typeof rawBody !== 'string') {
      if (typeof rawBody === 'object') {
        rawBody = JSON.stringify(rawBody);
      } else {
        return { category: 'Formatters', tool: 'JSON Formatter', value: '' };
      }
    }

    return {
      category: 'Formatters',
      tool: 'JSON Formatter',
      value: this.formatterService.format(rawBody),
    };
  }

  @Post('json-compare')
  @ApiOperation({ summary: 'Compara dois JSONs e lista as diferenças' })
  compareJson(@Body() body: JsonCompareDto) {
    return {
      category: 'Formatters',
      tool: 'JSON Comparator',
      differences: this.comparatorService.compare(body.left, body.right),
    };
  }
}
