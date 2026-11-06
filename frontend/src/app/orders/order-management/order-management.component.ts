import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Client } from '../../client.model';
import { ClientsService } from '../../clients.service';
import { Order, OrderInput, ORDER_STATUSES, OrderStatus } from '../../order.model';
import { OrdersService } from '../../orders.service';
import { OrderFormComponent, OrderFormGroup } from '../order-form/order-form.component';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'app-order-management',
  imports: [OrderFormComponent, OrderListComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
})
export class OrderManagementComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly ordersService = inject(OrdersService);

  // El estado de la administración se centraliza aquí; los componentes hijos solo presentan datos.
  protected readonly clients = signal<Client[]>([]);
  protected readonly orders = signal<Order[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly saving = signal(false);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly statuses = ORDER_STATUSES;

  // Relaciona el ID guardado en cada orden con el nombre legible del cliente.
  protected readonly clientsById = computed(
    () => new Map(this.clients().map((client) => [client._id, client.name])),
  );

  // Busca en memoria por orden, cliente, equipo, estado y detalles del servicio.
  protected readonly filteredOrders = computed(() => {
    const terms = this.normalize(this.searchTerm()).split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return this.orders();
    }

    return this.orders().filter((order) => {
      const customerName = this.clientsById().get(order.customerId) ?? '';
      const searchable = this.normalize(
        [
          order._id,
          order.customerId,
          customerName,
          order.deviceType,
          order.brandModel,
          order.serialNumber,
          order.reportedFailure,
          order.status,
          order.budget?.toString() ?? '',
          order.technicalNotes ?? '',
        ].join(' '),
      );
      const compactSearchable = searchable.replace(/[^a-z0-9]/g, '');

      return terms.every((term) => {
        const compactTerm = term.replace(/[^a-z0-9]/g, '');
        return searchable.includes(term) || compactSearchable.includes(compactTerm);
      });
    });
  });

  // El formulario refleja los campos y validaciones que exige el esquema del backend.
  protected readonly orderForm: OrderFormGroup = new FormGroup({
    customerId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    deviceType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)],
    }),
    brandModel: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
    }),
    serialNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
    }),
    passwordOrPattern: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    reportedFailure: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(1000)],
    }),
    status: new FormControl<OrderStatus>('Recibido', { nonNullable: true }),
    budget: new FormControl<number | null>(null, [Validators.min(0)]),
    technicalNotes: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(2000)],
    }),
  });

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.errorMessage.set('');

    // Clientes y órdenes se cargan juntas para poblar el selector y la tabla.
    forkJoin({
      clients: this.clientsService.getAll(),
      orders: this.ordersService.getAll(),
    }).subscribe({
      next: ({ clients, orders }) => {
        this.clients.set(clients);
        this.orders.set(orders);
        this.loadFailed.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudieron cargar las órdenes.'));
        this.loadFailed.set(true);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected saveOrder(): void {
    // Ejecuta las validaciones para mostrar errores antes de hacer la petición.
    this.orderForm.markAllAsTouched();
    if (this.orderForm.invalid || this.saving()) {
      return;
    }

    const value = this.orderForm.getRawValue();
    // Omite el presupuesto si quedó vacío; el backend lo define como opcional.
    const order: OrderInput = {
      customerId: value.customerId,
      deviceType: value.deviceType.trim(),
      brandModel: value.brandModel.trim(),
      serialNumber: value.serialNumber.trim(),
      passwordOrPattern: value.passwordOrPattern.trim(),
      reportedFailure: value.reportedFailure.trim(),
      status: value.status,
      ...(value.budget !== null ? { budget: value.budget } : {}),
      technicalNotes: value.technicalNotes.trim(),
    };
    const editingId = this.editingId();
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request = editingId
      ? this.ordersService.update(editingId, order)
      : this.ordersService.create(order);

    request.subscribe({
      next: (savedOrder) => {
        if (editingId) {
          this.orders.update((current) =>
            current.map((item) => (item._id === editingId ? savedOrder : item)),
          );
          this.successMessage.set(`La orden ${savedOrder._id} se actualizó.`);
        } else {
          this.orders.update((current) => [savedOrder, ...current]);
          this.successMessage.set(`La orden ${savedOrder._id} se creó correctamente.`);
        }
        this.resetForm();
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudo guardar la orden.'));
        this.saving.set(false);
      },
    });
  }

  protected editOrder(order: Order): void {
    // Copia la orden seleccionada al formulario y activa el modo edición.
    this.editingId.set(order._id);
    this.orderForm.setValue({
      customerId: order.customerId,
      deviceType: order.deviceType,
      brandModel: order.brandModel,
      serialNumber: order.serialNumber,
      passwordOrPattern: order.passwordOrPattern,
      reportedFailure: order.reportedFailure,
      status: order.status,
      budget: order.budget ?? null,
      technicalNotes: order.technicalNotes ?? '',
    });
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  protected deleteOrder(order: Order): void {
    // Pide confirmación antes de eliminar el registro de forma permanente.
    if (this.deletingId() || !window.confirm(`¿Eliminar la orden ${order._id}?`)) {
      return;
    }

    this.deletingId.set(order._id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.ordersService.delete(order._id).subscribe({
      next: () => {
        this.orders.update((current) => current.filter((item) => item._id !== order._id));
        if (this.editingId() === order._id) {
          this.resetForm();
        }
        this.successMessage.set(`La orden ${order._id} se eliminó.`);
        this.deletingId.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'No se pudo eliminar la orden.'));
        this.deletingId.set(null);
      },
    });
  }

  protected resetForm(): void {
    // Restablece valores iniciales para que el próximo envío cree una nueva orden.
    this.orderForm.reset({
      customerId: '',
      deviceType: '',
      brandModel: '',
      serialNumber: '',
      passwordOrPattern: '',
      reportedFailure: '',
      status: 'Recibido',
      budget: null,
      technicalNotes: '',
    });
    this.editingId.set(null);
  }

  protected setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
  }

  private normalize(value: string): string {
    // Facilita la búsqueda sin importar mayúsculas ni tildes.
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
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
