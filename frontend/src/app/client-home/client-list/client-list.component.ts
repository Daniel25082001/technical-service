import { Component, input, output } from '@angular/core';
import { Client } from '../../client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent {
  // Datos y estados que el padre proporciona para dibujar la lista.
  readonly clients = input.required<Client[]>();
  readonly filteredClients = input.required<Client[]>();
  readonly searchTerm = input.required<string>();
  readonly loading = input(false);
  readonly loadFailed = input(false);
  readonly deletingId = input<string | null>(null);
  // Función recibida del padre para presentar la dirección compactada en la tabla.
  readonly formatAddress = input.required<(value: string) => string>();

  // Eventos que permiten al padre ejecutar las acciones y mantener el estado centralizado.
  readonly refresh = output<void>();
  readonly search = output<string>();
  readonly clearSearch = output<void>();
  readonly edit = output<Client>();
  readonly delete = output<Client>();

  protected updateSearchTerm(event: Event): void {
    // Envía el texto de búsqueda al padre, que recalcula la lista filtrada.
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
