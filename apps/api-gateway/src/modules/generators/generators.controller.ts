import { Controller, Get, Query } from '@nestjs/common';
import { CpfGeneratorService } from './services/cpf-generator.service';
import {CnpjGeneratorService} from "./services/cnpj-generator.service";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Generators')
@Controller('generators')
export class GeneratorsController {
    constructor(
        private readonly cpfService: CpfGeneratorService,
        private readonly cnpjService: CnpjGeneratorService,
    ) {}

    @Get('cpf')
    generateCpf(@Query('format') format: string) {
        const shouldFormat = format !== 'false';

        return {
            category: 'Generators',
            tool: 'CPF',
            value: this.cpfService.generate(shouldFormat),
        };
    }

    @Get('cnpj')
    generateCnpj(@Query('format') format: string) {
        const shouldFormat = format !== 'false';

        return {
            category: 'Generators',
            tool: 'CNPJ',
            value: this.cnpjService.generate(shouldFormat),
        };
    }
}