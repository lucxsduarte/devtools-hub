import { Controller, Post, Body } from '@nestjs/common';
import { JsonFormatterService } from './services/json-formatter.service';
import { JsonComparatorService } from './services/json-comparator.service';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {JsonCompareDto, JsonFormatDto} from "./dtos/formatter-inputs.dto";

@ApiTags('Formatters')
@Controller('formatters')
export class FormattersController {
    constructor(
        private readonly formatterService: JsonFormatterService,
        private readonly comparatorService: JsonComparatorService,
    ) {}

    @Post('json-format')
    @ApiOperation({ summary: 'Formata e indenta um JSON minificado' })
    formatJson(@Body() body: JsonFormatDto) {
        return {
            category: 'Formatters',
            tool: 'JSON Formatter',
            value: this.formatterService.format(body.json),
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