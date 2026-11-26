import type { Routes } from '@angular/router';
import { ROUTE_PATHS } from './core/constants/routes.const';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTE_PATHS.SUMMARIZER,
  },
  {
    path: ROUTE_PATHS.COUNTRY,
    loadComponent: () => import('./features/country/country.component'),
  },
  {
    path: ROUTE_PATHS.SUMMARIZER,
    loadComponent: () => import('./features/summarizer/summarizer.component'),
  },
  {
    path: '**',
    redirectTo: ROUTE_PATHS.COUNTRY,
  },
];
