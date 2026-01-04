import {Controller, Get, Query} from '@nestjs/common';
import {CatalogService} from "./catalog.service";

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get()
    getTools(@Query('q') query: string) {
        if (query) {
            return this.catalogService.searchTools(query);
        }
        return this.catalogService.getAllTools();
    }
}
