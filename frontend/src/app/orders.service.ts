import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderInput } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  // Mantiene centralizadas las llamadas HTTP al recurso de órdenes.
  private readonly apiUrl = 'http://localhost:3000/orders';

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  create(order: OrderInput): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  update(id: string, order: OrderInput): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${encodeURIComponent(id)}`, order);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
