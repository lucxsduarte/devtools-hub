import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io'; // Você já configurou isso no app.config
import { Observable, firstValueFrom, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InspectionResponse {
  status: 'completed' | 'accepted' | 'error';
  message: string;
  data?: any;
  fromCache?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class InspectorService {
  private http = inject(HttpClient);
  private socket = inject(Socket);

  private readonly apiUrl = `${environment.apiUrl}/utilities/site-inspector`;


  async inspectUrl(url: string): Promise<any> {
    const socketId = this.socket.ioSocket.id;

    if (!socketId) {
      throw new Error('WebSocket não conectado via ngx-socket-io');
    }

    const payload = { url, socketId };

    // Observação: Seu controller retorna { category, tool, data: {...} }
    // Vamos pegar direto a propriedade .data
    const response: any = await firstValueFrom(this.http.post(this.apiUrl, payload));

    const apiData = response.data;

    // CENÁRIO A: Cache Hit (Veio do Redis)
    // Se já vier com status 'completed' ou tiver dados, retornamos na hora
    if (apiData.fromCache || apiData.status === 'completed' || apiData.data) {
      return apiData.data || apiData;
    }

    // CENÁRIO B: Cache Miss (Foi pro RabbitMQ)
    // Precisamos esperar o Java avisar pelo WebSocket
    return this.waitForSocketResult();
  }

  /**
   * Cria uma Promessa que fica esperando o evento do WebSocket
   */
  private waitForSocketResult(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Nome do evento que o Java ou o Nest envia de volta
      // (Certifique-se que seu backend emite 'site-analysis-result' ou mude aqui)
      this.socket.once('site-analysis-result', (data: any) => {
        resolve(data);
      });

      // Timeout de segurança (30s)
      setTimeout(() => {
        reject(new Error('Tempo limite de análise excedido (Worker demorou muito).'));
      }, 30000);
    });
  }
}
