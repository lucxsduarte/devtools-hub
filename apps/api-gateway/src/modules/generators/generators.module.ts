import { Module } from '@nestjs/common';
import { CpfGeneratorService } from './services/cpf-generator.service';
import {GeneratorsController} from "./generators.controller";

@Module({
  controllers: [GeneratorsController],
  providers: [CpfGeneratorService]
})
export class GeneratorsModule {}
