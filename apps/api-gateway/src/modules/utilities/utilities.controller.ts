import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteInspectorService } from './services/site-inspector.service';
import { InspectSiteDto } from './dtos/inspect-site.dto';

@ApiTags('Utilities')
@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly siteInspectorService: SiteInspectorService) {}
  
  @Post('site-inspector')
  @ApiOperation({ summary: 'Envia site para análise' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string', example: 'https://www.google.com' },
        socketId: {
          type: 'string',
          example: 'User_Connection_123',
          description: 'O ID da conexão WebSocket do usuário (opcional)',
        },
      },
    },
  })
  analyzeSite(@Body() body: InspectSiteDto) {
    return {
      category: 'Utilities',
      tool: 'Site Inspector',
      data: this.siteInspectorService.inspect(body.url, body.socketId),
    };
  }
}
