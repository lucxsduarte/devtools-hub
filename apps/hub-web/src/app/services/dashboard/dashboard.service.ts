import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/dashboard';

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
