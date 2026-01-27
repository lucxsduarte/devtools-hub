import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InspectorComponent } from './pages/inspector/inspector.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'DevTools Hub - Home' },
  { path: 'inspector', component: InspectorComponent },
  { path: '**', redirectTo: '' },
];
