import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getWeather(lat: number, lon: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/weather?lat=${lat}&lon=${lon}`);
  }

  getFinance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/finance`);
  }

  getQuote(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quote`);
  }
}
