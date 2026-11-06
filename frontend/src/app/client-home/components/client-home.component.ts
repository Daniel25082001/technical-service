import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Client, ClientInput } from '../../client.model';
import { ClientsService } from '../../clients.service';
import { ClientFormComponent, ClientFormGroup } from '../client-form/client-form.component';
import { ClientListComponent } from '../client-list/client-list.component';

const ADDRESS_PREFIX = 'client-address:v1:';

// La API guarda la dirección en un solo campo; este tipo representa sus partes en el frontend.
interface ClientAddressFields {
  locality: string;
  street: string;
  number: string;
  floor: string;
}

@Component({
  selector: 'app-client-home',
  imports: [ClientFormComponent, ClientListComponent],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.scss',
})
export class ClientHomeComponent implements OnInit {
  // Servicio que centraliza las solicitudes HTTP al recurso /clients.
  private readonly clientsService = inject(ClientsService);

  // Estado reactivo de la pantalla; Angular actualiza la vista cuando estos valores cambian.
  protected readonly clients = signal<Client[]>([]);
  protected readonly searchTerm = signal('');

  // Filtra en memoria y exige que cada palabra buscada aparezca en algún dato del cliente.
  protected readonly filteredClients = computed(() => {
    const terms = this.normalizeSearch(this.searchTerm()).split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return this.clients();
    }

    return this.clients().filter((client) => {
      const address = this.parseAddress(client.address);
      const searchable = this.normalizeSearch(
        [
          client.name,
          client._id,
          client.phone,
          client.address,
          address.locality,
          address.street,
          address.number,
          address.floor,
        ].join(' '),
      );
      // Quitar separadores permite encontrar teléfonos aunque se escriban con otro formato.
      const compactSearchable = searchable.replace(/[^a-z0-9]/g, '');

      return terms.every((term) => {
        const compactTerm = term.replace(/[^a-z0-9]/g, '');
        return searchable.includes(term) || compactSearchable.includes(compactTerm);
      });
    });
  });
  // Indicadores que controlan mensajes, botones y spinners de la pantalla.
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  // Formulario tipado y validado antes de enviar datos a la API.
  protected readonly clientForm: ClientFormGroup = new FormGroup({
    // Nombre obligatorio, no vacío y limitado a 100 caracteres.
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
    }),
    // Teléfono con 4 dígitos de área, guion y 6 dígitos de número.
    phone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{6}$/),
      ],
    }),
    // Partes de la dirección: localidad, calle y altura son obligatorias; piso es opcional.
    locality: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)],
    }),
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
    }),
    number: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(20)],
    }),
    floor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(20)],
    }),
  });

  ngOnInit(): void {
    // Carga el listado apenas se crea la pantalla.
    this.loadClients();
  }

  protected loadClients(): void {
    // Prepara los estados de carga antes de iniciar la petición.
    this.loading.set(true);
    this.loadFailed.set(false);
    this.errorMessage.set('');
    // subscribe procesa la respuesta asíncrona de HttpClient.
    this.clientsService.getAll().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loadFailed.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudieron cargar los clientes.'));
        this.loadFailed.set(true);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected saveClient(): void {
    // Marca todos los campos para mostrar errores si se intenta enviar un formulario inválido.
    this.clientForm.markAllAsTouched();
    if (this.clientForm.invalid || this.saving()) {
      return;
    }

    const formValue = this.clientForm.getRawValue();
    // El backend espera name, phone y address; por eso compactamos las partes de la dirección.
    const client: ClientInput = {
      name: formValue.name.trim(),
      phone: formValue.phone.trim(),
      address: this.serializeAddress({
        locality: formValue.locality.trim(),
        street: formValue.street.trim(),
        number: formValue.number.trim(),
        floor: formValue.floor.trim(),
      }),
    };
    const editingId = this.editingId();
    // Deshabilita envíos repetidos y limpia mensajes de una operación anterior.
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request = editingId
      // Con ID existente se actualiza; sin ID se crea un cliente nuevo.
      ? this.clientsService.update(editingId, client)
      : this.clientsService.create(client);

    // Actualiza la lista local al completar la operación, sin volver a pedir todos los clientes.
    request.subscribe({
      next: (savedClient) => {
        if (editingId) {
          this.clients.update((current) =>
            current.map((item) => (item._id === editingId ? savedClient : item)),
          );
          this.successMessage.set('Los datos del cliente se actualizaron.');
        } else {
          this.clients.update((current) => [savedClient, ...current]);
          this.successMessage.set('El cliente se guardó correctamente.');
        }
        this.resetForm();
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudo guardar el cliente.'));
        this.saving.set(false);
      },
    });
  }

  protected editClient(client: Client): void {
    // Separa la dirección guardada y carga sus valores en el formulario.
    const address = this.parseAddress(client.address);
    this.editingId.set(client._id);
    this.clientForm.setValue({
      name: client.name,
      phone: this.formatPhoneNumber(client.phone),
      ...address,
    });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  protected deleteClient(client: Client): void {
    // Evita borrar accidentalmente y bloquea otra eliminación mientras haya una en curso.
    if (this.deletingId() || !window.confirm(`¿Eliminar al cliente ${client.name}?`)) {
      return;
    }

    this.deletingId.set(client._id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.clientsService.delete(client._id).subscribe({
      next: () => {
        this.clients.update((current) => current.filter((item) => item._id !== client._id));
        if (this.editingId() === client._id) {
          this.resetForm();
        }
        this.successMessage.set(`Se eliminó el cliente ${client.name}.`);
        this.deletingId.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudo eliminar el cliente.'));
        this.deletingId.set(null);
      },
    });
  }

  protected resetForm(): void {
    // También limpia el modo edición, para que el próximo envío cree un cliente.
    this.clientForm.reset();
    this.editingId.set(null);
  }

  protected setSearchTerm(value: string): void {
    // Actualiza el término que usa filteredClients para recalcular los resultados.
    this.searchTerm.set(value);
  }

  protected clearSearch(): void {
    // Un término vacío hace que el filtro devuelva todos los clientes.
    this.searchTerm.set('');
  }

  // Convierte las partes de la dirección guardada en una sola línea para la tabla.
  protected readonly formatAddressForDisplay = (value: string): string => {
    const address = this.parseAddress(value);
    const street = [address.street, address.number].filter(Boolean).join(' ');
    return [street, address.floor ? `Piso ${address.floor}` : '', address.locality]
      .filter(Boolean)
      .join(', ');
  };

  private formatPhoneNumber(value: string): string {
    // Conserva solo 10 dígitos y agrega el guion después del código de área de 4 dígitos.
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 4) {
      return digits.length === 4 ? `${digits}-` : digits;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  private serializeAddress(address: ClientAddressFields): string {
    // El prefijo identifica el formato nuevo y permite reconocerlo al volver a editar.
    return `${ADDRESS_PREFIX}${JSON.stringify(address)}`;
  }

  private parseAddress(value: string): ClientAddressFields {
    // Las direcciones nuevas tienen un prefijo y un JSON que se puede separar con seguridad.
    if (value.startsWith(ADDRESS_PREFIX)) {
      try {
        const parsed: unknown = JSON.parse(value.slice(ADDRESS_PREFIX.length));
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'locality' in parsed &&
          'street' in parsed &&
          'number' in parsed &&
          'floor' in parsed &&
          typeof parsed.locality === 'string' &&
          typeof parsed.street === 'string' &&
          typeof parsed.number === 'string' &&
          typeof parsed.floor === 'string'
        ) {
          return {
            locality: parsed.locality,
            street: parsed.street,
            number: parsed.number,
            floor: parsed.floor,
          };
        }
      } catch {
        // Si el contenido guardado no es válido, se conserva como texto de dirección antiguo.
      }
    }

    // Compatibilidad con clientes guardados antes de separar localidad, calle, altura y piso.
    return { locality: '', street: value, number: '', floor: '' };
  }

  private normalizeSearch(value: string): string {
    // Permite buscar sin distinguir mayúsculas ni acentos (por ejemplo, "Jose" y "José").
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    // Prioriza el mensaje de la API y da una indicación especial si no hay conexión.
    const message = error.error?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verificá que el backend esté iniciado.';
    }
    return fallback;
  }
}
