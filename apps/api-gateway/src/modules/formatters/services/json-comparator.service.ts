import { Injectable, BadRequestException } from '@nestjs/common';
import {parseLooseJson} from "../../utils/json.helper";
import {DiffResult} from "../interfaces/formatter.interfaces";

@Injectable()
export class JsonComparatorService {

    compare(jsonLeft: string, jsonRight: string): DiffResult[] {
        let obj1, obj2;

        try {
            obj1 = parseLooseJson(jsonLeft);
            obj2 = parseLooseJson(jsonRight);
        } catch (e) {
            throw new BadRequestException('Um dos JSONs enviados é inválido ou não pode ser interpretado.');
        }

        return this.findDifferences(obj1, obj2);
    }
    private findDifferences(obj1: any, obj2: any, path: string = ''): DiffResult[] {
        let diffs: DiffResult[] = [];

        const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

        keys.forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            const val1 = obj1 ? obj1[key] : undefined;
            const val2 = obj2 ? obj2[key] : undefined;

            if (this.isObject(val1) && this.isObject(val2)) {
                diffs = diffs.concat(this.findDifferences(val1, val2, newPath));
            } else if (val1 !== val2) {
                diffs.push({
                    path: newPath,
                    leftValue: val1 === undefined ? 'MISSING' : val1,
                    rightValue: val2 === undefined ? 'MISSING' : val2,
                });
            }
        });

        return diffs;
    }

    private isObject(value: any): boolean {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
}