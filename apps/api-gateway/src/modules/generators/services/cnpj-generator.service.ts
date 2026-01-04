import { Injectable } from '@nestjs/common';

@Injectable()
export class CnpjGeneratorService {

    generate(format: boolean = true): string {
        const numbers = Array.from({ length: 8 }, () => this.randomDigit());
        numbers.push(0, 0, 0, 1);
        numbers.push(this.calculateDigit(numbers, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]));
        numbers.push(this.calculateDigit(numbers, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]));
        const cnpjRaw = numbers.join('');
        return format ? this.formatCnpj(cnpjRaw) : cnpjRaw;
    }

    private calculateDigit(numbers: number[], weights: number[]): number {
        const sum = numbers.reduce((acc, num, index) => acc + num * weights[index], 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    private randomDigit(): number {
        return Math.floor(Math.random() * 10);
    }

    private formatCnpj(cnpj: string): string {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
}