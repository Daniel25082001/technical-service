import { Component, input, output } from '@angular/core';
import { Client } from '../../client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent {
  readonly clients = input.required<Client[]>();
  readonly filteredClients = input.required<Client[]>();
  readonly searchTerm = input.required<string>();
  readonly loading = input(false);
  readonly loadFailed = input(false);
  readonly deletingId = input<string | null>(null);
  readonly formatAddress = input.required<(value: string) => string>();
  readonly refresh = output<void>();
  readonly search = output<string>();
  readonly clearSearch = output<void>();
  readonly edit = output<Client>();
  readonly delete = output<Client>();

  protected updateSearchTerm(event: Event): void {
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
