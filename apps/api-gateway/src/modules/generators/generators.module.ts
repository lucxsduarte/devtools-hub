import { Module } from '@nestjs/common';
import { CpfGeneratorService } from './services/cpf-generator.service';
import { GeneratorsController } from './generators.controller';
import { CnpjGeneratorService } from './services/cnpj-generator.service';

@Module({
  controllers: [GeneratorsController],
  providers: [CpfGeneratorService, CnpjGeneratorService],
})
export class GeneratorsModule {}
