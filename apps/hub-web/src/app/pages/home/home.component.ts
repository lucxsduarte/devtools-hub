import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  weatherData = signal<any>(null);
  financeData = signal<any>(null);
  quoteData = signal<any>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.initDashboard();
  }

  initDashboard() {
    // 1. Primeiro resolvemos a localização (que é a parte mais demorada/incerta)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.fetchAllData(latitude, longitude);
        },
        (err) => {
          console.warn('Localização negada/erro, usando padrão.', err);
          this.fetchAllData(-23.55, -46.63); // Fallback SP
        },
      );
    } else {
      this.fetchAllData(-23.55, -46.63);
    }
  }

  fetchAllData(lat: number, lon: number) {
    forkJoin({
      weather: this.dashboardService.getWeather(lat, lon),
      finance: this.dashboardService.getFinance(),
      quote: this.dashboardService.getQuote(),
    }).subscribe({
      next: (results) => {
        this.weatherData.set(results.weather);

        const items = Object.values(results.finance);
        this.financeData.set(items);

        this.quoteData.set(results.quote);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro crítico ao carregar dashboard:', err);
        this.loading.set(false);
      },
    });
  }

}
