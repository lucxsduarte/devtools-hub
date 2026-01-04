import { Controller, Get, Query } from '@nestjs/common';
import { CpfGeneratorService } from './services/cpf-generator.service';

@Controller('generators')
export class GeneratorsController {
    constructor(private readonly cpfService: CpfGeneratorService) {}

    @Get('cpf')
    generateCpf(@Query('format') format: string) {
        const shouldFormat = format !== 'false';

        return {
            category: 'Generators',
            tool: 'CPF',
            value: this.cpfService.generate(shouldFormat),
        };
    }
}