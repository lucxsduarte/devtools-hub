// src/modules/core/catalog.service.ts
import { Injectable } from '@nestjs/common';
import { ToolMetadata } from '../../../commons/interfaces/tool.interface';

@Injectable()
export class CatalogService {
  private tools: ToolMetadata[] = [
    {
      id: 'cpf-gen',
      name: 'Gerador de CPF',
      category: 'Generators',
      description: 'Gera um CPF válido.',
      keywords: ['cpf', 'gerador', 'documento', 'cadastro'],
      endpoint: '/generators/cpf',
    },
    {
      id: 'cnpj-gen',
      name: 'Gerador de CNPJ',
      category: 'Generators',
      description: 'Gera um CNPJ válido.',
      keywords: ['cnpj', 'gerador', 'empresa', 'documento', 'cadastro'],
      endpoint: '/generators/cnpj',
    },
    {
      id: 'json-format',
      name: 'Formatador de JSON',
      category: 'Formatters',
      description: 'Indenta e organiza JSONs bagunçados.',
      keywords: ['json', 'pretty', 'format', 'lint'],
      endpoint: '/formatters/json-format',
    },
    {
      id: 'json-compare',
      name: 'Comparador de JSON',
      category: 'Formatters',
      description: 'Compara dois JSONs e mostra as diferenças.',
      keywords: ['json', 'diff', 'compare', 'diferenca'],
      endpoint: '/formatters/json-compare',
    },
    // Adicionaremos mais aqui conforme você implementar
  ];

  getAllTools() {
    return this.tools;
  }

  searchTools(query: string) {
    const term = query.toLowerCase();
    return this.tools.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.keywords.some((k) => k.includes(term)),
    );
  }
}
