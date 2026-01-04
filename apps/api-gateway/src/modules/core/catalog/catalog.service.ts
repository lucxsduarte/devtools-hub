// src/modules/core/catalog.service.ts
import {Injectable} from '@nestjs/common';
import {ToolMetadata} from '../../../commons/interfaces/tool.interface';

@Injectable()
export class CatalogService {
    private tools: ToolMetadata[] = [
        {
            id: 'cpf-gen',
            name: 'Gerador de CPF',
            category: 'Generators',
            description: 'Gera um CPF válido com ou sem pontuação.',
            keywords: ['cpf', 'gerador', 'documento'],
            endpoint: '/generators/cpf',
        },
        {
            id: 'json-fmt',
            name: 'Formatador JSON',
            category: 'Formatters',
            description: 'Identar e organizar JSON minificado.',
            keywords: ['json', 'pretty', 'format'],
            endpoint: '/formatters/json',
        },
        // Adicionaremos mais aqui conforme você implementar
    ];

    getAllTools() {
        return this.tools;
    }

    searchTools(query: string) {
        const term = query.toLowerCase();
        return this.tools.filter(t =>
            t.name.toLowerCase().includes(term) ||
            t.keywords.some(k => k.includes(term))
        );
    }
}