import { Injectable, BadRequestException } from '@nestjs/common';
import {parseLooseJson} from "../../utils/json.helper";

@Injectable()
export class JsonFormatterService {

    format(jsonString: string): string {
        try {
            const object = parseLooseJson(jsonString);
            return JSON.stringify(object, null, 2);
        } catch (error) {
            throw new BadRequestException('Não foi possível entender esse JSON. Verifique a sintaxe.');
        }
    }

    minify(jsonString: string): string {
        try {
            const object = parseLooseJson(jsonString);
            return JSON.stringify(object);
        } catch (error) {
            throw new BadRequestException('JSON inválido.');
        }
    }
}