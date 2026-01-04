import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonFormatterService {

    format(jsonString: string): string {
        try {
            const object = JSON.parse(jsonString);

            return JSON.stringify(object, null, 2);
        } catch (error) {
            throw new BadRequestException('JSON inválido. Verifique a sintaxe.');
        }
    }

    minify(jsonString: string): string {
        try {
            const object = JSON.parse(jsonString);
            return JSON.stringify(object);
        } catch (error) {
            throw new BadRequestException('JSON inválido.');
        }
    }
}