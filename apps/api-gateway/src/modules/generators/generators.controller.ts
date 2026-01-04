import { Controller, Get, Query } from '@nestjs/common';
import { CpfGeneratorService } from './services/cpf-generator.service';
import {CnpjGeneratorService} from "./services/cnpj-generator.service";
import {ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";

@ApiTags('Generators')
@Controller('generators')
export class GeneratorsController {
    constructor(
        private readonly cpfService: CpfGeneratorService,
        private readonly cnpjService: CnpjGeneratorService,
    ) {}

    @Get('cpf')
    @ApiOperation({ summary: 'Gerar um CPF válido.' })
    @ApiQuery({
        name: 'format',
        type: Boolean,
        required: false,
        description: 'Adicionar pontuação?',
    })
    generateCpf(@Query('format') format: string) {
        const shouldFormat = format !== 'false';

        return {
            category: 'Generators',
            tool: 'CPF',
            value: this.cpfService.generate(shouldFormat),
        };
    }

    @Get('cnpj')
    @ApiOperation({ summary: 'Gera um CNPJ válido.'})
    @ApiQuery({
        name: 'format',
        type: Boolean,
        required: false,
        description: 'Adicionar pontuação?',
    })
    generateCnpj(@Query('format') format: string) {
        const shouldFormat = format !== 'false';

        return {
            category: 'Generators',
            tool: 'CNPJ',
            value: this.cnpjService.generate(shouldFormat),
        };
    }
}