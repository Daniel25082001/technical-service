import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order, OrderPayload } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/orders';

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(payload: OrderPayload): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, payload);
  }

  updateOrder(id: string, payload: Partial<OrderPayload>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, payload);
  }

  deleteOrder(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
