import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client-home/components/client-home.component';

export const routes: Routes = [
  { path: '', component: ClientHomeComponent, title: 'Inicio | Servicio técnico' },
  {
    path: 'ordenes',
    loadComponent: () =>
      import('./orders/order-management/order-management.component').then(
        (module) => module.OrderManagementComponent,
      ),
    title: 'Órdenes | Servicio técnico',
  },
  { path: '**', redirectTo: '' },
];
