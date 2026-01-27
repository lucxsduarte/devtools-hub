import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class InspectSiteDto {
  @IsNotEmpty({ message: 'A URL é obrigatória' })
  @IsUrl(
    { require_protocol: true },
    { message: 'Você deve fornecer uma URL válida (ex: https://google.com)' },
  )
  url: string;

  @IsString()
  @IsNotEmpty()
  socketId: string;
}
