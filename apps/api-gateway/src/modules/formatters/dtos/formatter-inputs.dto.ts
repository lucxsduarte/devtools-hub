import { ApiProperty } from '@nestjs/swagger';

export class JsonFormatDto {
    @ApiProperty({
        description: 'O JSON que você quer formatar (pode estar minificado)',
        example: '{"nome":"Lucas","cargo":"Dev"}'
    })
    json: string;
}

export class JsonCompareDto {
    @ApiProperty({
        description: 'O JSON original (lado esquerdo)',
        example: '{"versao": 1, "dados": [1,2,3]}'
    })
    left: string;

    @ApiProperty({
        description: 'O JSON novo (lado direito) para comparar',
        example: '{"versao": 2, "dados": [1,2,3,4]}'
    })
    right: string;
}