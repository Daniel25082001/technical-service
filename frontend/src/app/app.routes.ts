import { Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';
import { SectionPageComponent } from './section-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: SectionPageComponent, data: { page: 'dashboard' } },
  { path: 'landing', component: LandingPageComponent },
  { path: 'clientes', component: SectionPageComponent, data: { page: 'clients' } },
  { path: 'ordenes', component: SectionPageComponent, data: { page: 'orders' } },
  { path: 'reportes', component: SectionPageComponent, data: { page: 'reports' } }
];
