import { Injectable } from '@nestjs/common';

@Injectable()
export class CpfGeneratorService {

    generate(format: boolean = true): string {
        const num1 = this.randomDigit();
        const num2 = this.randomDigit();
        const num3 = this.randomDigit();
        const num4 = this.randomDigit();
        const num5 = this.randomDigit();
        const num6 = this.randomDigit();
        const num7 = this.randomDigit();
        const num8 = this.randomDigit();
        const num9 = this.randomDigit();

        // Cálculo do primeiro dígito verificador
        let sum = (num1 * 10) + (num2 * 9) + (num3 * 8) + (num4 * 7) + (num5 * 6) + (num6 * 5) + (num7 * 4) + (num8 * 3) + (num9 * 2);
        let remainder = sum % 11;
        const digit1 = remainder < 2 ? 0 : 11 - remainder;

        // Cálculo do segundo dígito verificador
        sum = (num1 * 11) + (num2 * 10) + (num3 * 9) + (num4 * 8) + (num5 * 7) + (num6 * 6) + (num7 * 5) + (num8 * 4) + (num9 * 3) + (digit1 * 2);
        remainder = sum % 11;
        const digit2 = remainder < 2 ? 0 : 11 - remainder;

        const cpfRaw = `${num1}${num2}${num3}${num4}${num5}${num6}${num7}${num8}${num9}${digit1}${digit2}`;

        return format ? this.formatCpf(cpfRaw) : cpfRaw;
    }

    private randomDigit(): number {
        return Math.floor(Math.random() * 10);
    }

    private formatCpf(cpf: string): string {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}