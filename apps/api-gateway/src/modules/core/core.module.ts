import { Module } from '@nestjs/common';
import { CatalogService } from './catalog/catalog.service';
import { CatalogController } from './catalog/catalog.controller';

@Module({
  providers: [CatalogService],
  controllers: [CatalogController]
})
export class CoreModule {}
