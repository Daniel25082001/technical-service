import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client-home/client-home.componets/client-home.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';

export const routes: Routes = [
  { path: '', component: ClientHomeComponent, title: 'Inicio | Servicio técnico' },
  { path: 'seguimiento', component: OrderTrackingComponent, title: 'Seguimiento | Servicio técnico' },
  { path: '**', redirectTo: '' },
];
