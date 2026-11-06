import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Order } from '../../order.model';

@Component({
  selector: 'app-order-list',
  imports: [CurrencyPipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  // El padre envía las órdenes, el filtro y los estados de carga.
  readonly orders = input.required<Order[]>();
  readonly filteredOrders = input.required<Order[]>();
  readonly clientsById = input.required<Map<string, string>>();
  readonly searchTerm = input.required<string>();
  readonly loading = input(false);
  readonly loadFailed = input(false);
  readonly deletingId = input<string | null>(null);
  // Acciones emitidas al padre; allí se llaman los endpoints de la API.
  readonly refresh = output<void>();
  readonly search = output<string>();
  readonly clearSearch = output<void>();
  readonly edit = output<Order>();
  readonly delete = output<Order>();

  protected updateSearchTerm(event: Event): void {
    this.search.emit((event.target as HTMLInputElement).value);
  }

  protected clientName(customerId: string): string {
    return this.clientsById().get(customerId) ?? customerId;
  }
}
