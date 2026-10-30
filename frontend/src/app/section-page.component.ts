import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { Client, ClientPayload } from './client.model';
import { ClientsService } from './clients.service';
import { Order, OrderStatus } from './order.model';
import { OrdersService } from './orders.service';

type SectionPage = 'dashboard' | 'clients' | 'orders' | 'reports';

@Component({
  selector: 'app-section-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="alerts" *ngIf="error || success || clientError || clientSuccess">
      <div class="alert error" *ngIf="error">{{ error }}</div>
      <div class="alert success" *ngIf="success">{{ success }}</div>
      <div class="alert error" *ngIf="clientError">{{ clientError }}</div>
      <div class="alert success" *ngIf="clientSuccess">{{ clientSuccess }}</div>
    </div>

    <section *ngIf="page === 'dashboard' || page === 'reports'" id="dashboard-section" class="summary-grid" aria-label="Resumen de órdenes">
      <article class="summary-card accent">
        <span>Total</span>
        <strong>{{ summary.total }}</strong>
      </article>
      <article class="summary-card">
        <span>Ingresos estimados</span>
        <strong>{{ summary.revenue | currency:'ARS' }}</strong>
      </article>
      <article class="summary-card">
        <span>Presupuestar</span>
        <strong>{{ summary.budget }}</strong>
      </article>
      <article class="summary-card">
        <span>En reparación</span>
        <strong>{{ summary.repair }}</strong>
      </article>
      <article class="summary-card">
        <span>Promedio por orden</span>
        <strong>{{ summary.avgBudget | currency:'ARS' }}</strong>
      </article>
    </section>

    <section *ngIf="page === 'dashboard' || page === 'reports'" id="report-section" class="report-panel">
      <div class="report-header">
        <div>
          <p class="mini-label">Reporte</p>
          <h2>Control operativo</h2>
        </div>
        <span class="status-pill">{{ summary.total }} casos activos</span>
      </div>

      <div class="report-grid">
        <div class="report-item" *ngFor="let item of reportRows">
          <span>{{ item.label }}</span>
          <strong>{{ item.count }}</strong>
        </div>
      </div>
    </section>

    <div class="layout">
      <div class="stacked-forms">
        <form *ngIf="page === 'clients' || page === 'dashboard'" id="clients-section" class="order-form client-form" (ngSubmit)="createClient()">
          <div class="section-heading">
            <div>
              <p class="mini-label">Clientes</p>
              <h2>Nuevo cliente</h2>
            </div>
          </div>

          <div class="grid client-grid">
            <label class="full-width">
              <span>Nombre completo</span>
              <input
                [(ngModel)]="clientForm.name"
                name="clientName"
                placeholder="Ej: Juan Pérez"
                [ngClass]="{ 'input-invalid': clientNameInvalid }"
                (input)="validateClientName($any($event.target).value)"
              />
              <small class="field-error" *ngIf="clientNameInvalid || clientNameError">{{ clientNameError || 'Valor no válido: el nombre no puede contener números.' }}</small>
            </label>

            <label class="full-width">
              <span>Teléfono</span>
              <input
                [(ngModel)]="clientForm.phone"
                name="clientPhone"
                placeholder="Ej: 3462-123456"
                [ngClass]="{ 'input-invalid': phoneInvalid }"
                (input)="formatPhoneInput($any($event.target).value)"
              />
              <small class="field-error" *ngIf="phoneInvalid || phoneError">{{ phoneError || 'Valor no válido: usa formato 3462-683521.' }}</small>
            </label>

            <label class="full-width">
              <span>Dirección</span>
              <textarea [(ngModel)]="clientForm.address" name="clientAddress" rows="2" placeholder="Calle, altura, localidad"></textarea>
            </label>
          </div>

          <button type="submit" class="primary-btn" [disabled]="clientSubmitting">
            {{ clientSubmitting ? 'Guardando...' : 'Guardar cliente' }}
          </button>
        </form>

        <form *ngIf="page === 'orders' || page === 'dashboard'" class="order-form" (ngSubmit)="createOrder()">
          <div class="section-heading">
            <div>
              <p class="mini-label">Órdenes</p>
              <h2>Nueva orden</h2>
            </div>
          </div>

          <div class="grid">
            <label class="full-width">
              <span>Cliente</span>
              <select [(ngModel)]="form.customerId" name="customerId">
                <option *ngFor="let client of clients" [value]="client._id">{{ client.name }} - {{ client.phone }}</option>
              </select>
            </label>

            <label>
              <span>Tipo de equipo</span>
              <input [(ngModel)]="form.deviceType" name="deviceType" placeholder="Ej: Celular, Notebook" />
            </label>

            <label>
              <span>Marca / Modelo</span>
              <input [(ngModel)]="form.brandModel" name="brandModel" placeholder="Ej: Samsung S24" />
            </label>

            <label>
              <span>Número de serie</span>
              <input [(ngModel)]="form.serialNumber" name="serialNumber" placeholder="123456789" />
            </label>

            <label>
              <span>Contraseña / patrón</span>
              <input [(ngModel)]="form.passwordOrPattern" name="passwordOrPattern" placeholder="Opcional" />
            </label>

            <label class="full-width">
              <span>Falla reportada</span>
              <textarea [(ngModel)]="form.reportedFailure" name="reportedFailure" rows="3" placeholder="Describe la falla"></textarea>
            </label>

            <label>
              <span>Estado</span>
              <select [(ngModel)]="form.status" name="status">
                <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
              </select>
            </label>

            <label>
              <span>Presupuesto</span>
              <input type="number" [(ngModel)]="form.budget" name="budget" min="0" />
            </label>

            <label class="full-width">
              <span>Notas técnicas</span>
              <textarea [(ngModel)]="form.technicalNotes" name="technicalNotes" rows="2" placeholder="Observaciones del técnico"></textarea>
            </label>
          </div>

          <button type="submit" class="primary-btn" [disabled]="submitting">
            {{ submitting ? 'Guardando...' : 'Guardar orden' }}
          </button>
        </form>
      </div>

      <section *ngIf="page === 'orders' || page === 'dashboard' || page === 'clients'" id="orders-section" class="orders-panel">
        <div class="orders-header">
          <h2>Órdenes</h2>
          <span>{{ orders.length }} registradas</span>
        </div>

        <div class="mini-panel">
          <div class="mini-header">
            <h3>Clientes</h3>
            <span>{{ clients.length }} activos</span>
          </div>

          <div class="toolbar compact-toolbar" *ngIf="clients.length > 0 || clientSearchTerm">
            <input
              type="search"
              [(ngModel)]="clientSearchTerm"
              (input)="syncDerivedState()"
              placeholder="Buscar cliente..."
              aria-label="Buscar cliente"
            />
          </div>

          <ul class="clients-list" *ngIf="filteredClients.length > 0">
            <li *ngFor="let client of filteredClients" [class.active-client]="selectedClientId === client._id">
              <button type="button" class="client-select" (click)="selectClient(client._id ?? '')">
                <div>
                  <strong>{{ client.name }}</strong>
                  <small>{{ client.phone }}</small>
                </div>
              </button>
              <button type="button" class="ghost-btn" (click)="deleteClient(client)">Eliminar</button>
            </li>
          </ul>

          <div *ngIf="filteredClients.length === 0 && clients.length > 0" class="empty-state small">No hay clientes para este buscador.</div>
          <div *ngIf="clients.length === 0" class="empty-state small">Todavía no hay clientes cargados.</div>
        </div>

        <div class="toolbar" *ngIf="orders.length > 0 || searchTerm || statusFilter !== 'Todos'">
          <input
            type="search"
            [(ngModel)]="searchTerm"
            (input)="syncDerivedState()"
            placeholder="Buscar orden..."
            aria-label="Buscar órdenes"
          />

          <select [(ngModel)]="statusFilter" (change)="syncDerivedState()" aria-label="Filtrar por estado">
            <option value="Todos">Todos</option>
            <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
          </select>
        </div>

        <div *ngIf="selectedClientId && selectedClient" class="client-summary">
          <div class="client-identity">
            <div class="client-avatar">{{ selectedClient.name.charAt(0).toUpperCase() }}</div>
            <div>
              <span>Cliente seleccionado</span>
              <strong>{{ selectedClient.name }}</strong>
            </div>
          </div>

          <div class="client-meta">
            <small>{{ selectedClient.phone }}</small>
            <small>{{ selectedClient.address }}</small>
            <small>{{ getClientOrderCount(selectedClient._id) }} órdenes registradas</small>
          </div>

          <button type="button" class="ghost-btn" (click)="selectedClientId = ''; syncDerivedState();">Quitar filtro</button>
        </div>

        <div *ngIf="selectedClientId && selectedClient" class="history-panel">
          <div class="history-header">
            <div>
              <p class="mini-label">Historial</p>
              <h3>Últimas intervenciones</h3>
            </div>
            <span>{{ selectedClientOrders.length }} registros</span>
          </div>

          <div *ngIf="selectedClientOrders.length === 0" class="empty-state small">Este cliente todavía no tiene órdenes.</div>

          <ul *ngIf="selectedClientOrders.length > 0" class="history-list">
            <li *ngFor="let order of selectedClientOrders.slice(0, 4)" class="history-item">
              <div class="history-main">
                <strong>{{ order.brandModel }}</strong>
                <small>{{ order.deviceType }}</small>
              </div>

              <div class="history-meta">
                <span class="status-badge" [ngClass]="statusClass(order.status)">{{ order.status }}</span>
                <small>{{ order.createdAt ? (order.createdAt | date: 'dd/MM/yyyy') : 'Sin fecha' }}</small>
              </div>
            </li>
          </ul>
        </div>

        <div *ngIf="loading" class="empty-state">Cargando órdenes...</div>
        <div *ngIf="!loading && orders.length === 0" class="empty-state">Todavía no hay órdenes cargadas.</div>
        <div *ngIf="!loading && filteredOrders.length === 0 && orders.length > 0" class="empty-state">No hay órdenes para este filtro.</div>

        <div *ngIf="!loading && filteredOrders.length > 0" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipo</th>
                <th>Estado</th>
                <th>Presupuesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders">
                <td class="cell-id">{{ order._id }}</td>
                <td>
                  <div class="device-box">
                    <strong>{{ order.brandModel }}</strong>
                    <small>{{ order.deviceType }}</small>
                    <small>{{ getClientName(order.customerId) }}</small>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="statusClass(order.status)">{{ order.status }}</span>
                  <select [(ngModel)]="order.status" (change)="updateStatus(order)" name="status-{{ order._id }}">
                    <option *ngFor="let status of statusOptions" [value]="status">{{ status }}</option>
                  </select>
                </td>
                <td>{{ order.budget ?? 0 | currency:'ARS' }}</td>
                <td>
                  <button type="button" class="danger-btn" (click)="deleteOrder(order)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styleUrl: './app.scss'
})
export class SectionPageComponent implements OnInit {
  page: SectionPage = 'dashboard';
  orders: Order[] = [];
  clients: Client[] = [];
  filteredClients: Client[] = [];
  filteredOrders: Order[] = [];
  selectedClientId = '';
  searchTerm = '';
  clientSearchTerm = '';
  statusFilter = 'Todos';
  loading = false;
  submitting = false;
  clientSubmitting = false;
  error = '';
  success = '';
  clientError = '';
  clientSuccess = '';
  clientNameError = '';
  phoneError = '';
  summary = {
    total: 0,
    received: 0,
    budget: 0,
    repair: 0,
    delivered: 0,
    warranty: 0,
    revenue: 0,
    avgBudget: 0
  };
  reportRows: Array<{ label: string; count: number }> = [];
  statusOptions: OrderStatus[] = [
    'Recibido',
    'Presupuestar',
    'En Reparación',
    'Finalizado',
    'Entregado',
    'Por Garantía'
  ];

  form = {
    customerId: '',
    deviceType: '',
    brandModel: '',
    serialNumber: '',
    passwordOrPattern: '',
    reportedFailure: '',
    status: 'Recibido' as OrderStatus,
    budget: 0,
    technicalNotes: ''
  };

  clientForm = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordersService: OrdersService,
    private readonly clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ page }) => {
      this.page = page ?? 'dashboard';
    });

    this.loadOrders();
    this.loadClients();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.summary = this.buildSummary(orders);
        this.reportRows = this.buildReportRows(orders);
        this.syncDerivedState();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las órdenes.';
        this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;

        if (clients.length === 0) {
          this.selectedClientId = '';
          this.form.customerId = '';
          this.syncDerivedState();
          return;
        }

        if (!this.form.customerId || !clients.some((client) => client._id === this.form.customerId)) {
          this.form.customerId = clients[0]._id ?? '';
        }

        if (!this.selectedClientId || !clients.some((client) => client._id === this.selectedClientId)) {
          this.selectedClientId = clients[0]._id ?? '';
        }

        this.syncDerivedState();
      },
      error: () => {
        this.clientError = 'No se pudieron cargar los clientes.';
      }
    });
  }

  syncDerivedState(): void {
    const orderTerm = this.searchTerm.trim().toLowerCase();
    const clientTerm = this.clientSearchTerm.trim().toLowerCase();

    this.filteredClients = this.clients.filter((client) => {
      if (!clientTerm) {
        return true;
      }

      const searchable = [client.name, client.phone, client.address].join(' ').toLowerCase();
      return searchable.includes(clientTerm);
    });

    this.filteredOrders = this.orders.filter((order) => {
      const matchesClient = !this.selectedClientId || order.customerId === this.selectedClientId;
      const matchesStatus = this.statusFilter === 'Todos' || order.status === this.statusFilter;
      const searchable = [
        order.brandModel,
        order.deviceType,
        order.serialNumber,
        order.reportedFailure,
        this.getClientName(order.customerId)
      ].join(' ').toLowerCase();

      const matchesSearch = !orderTerm || searchable.includes(orderTerm);
      return matchesClient && matchesStatus && matchesSearch;
    });
  }

  getClientName(customerId?: string): string {
    return this.clients.find((client) => client._id === customerId)?.name ?? 'Cliente no registrado';
  }

  getClientById(customerId?: string): Client | undefined {
    return this.clients.find((client) => client._id === customerId);
  }

  getClientOrderCount(customerId?: string): number {
    return this.orders.filter((order) => order.customerId === customerId).length;
  }

  get selectedClient(): Client | undefined {
    return this.getClientById(this.selectedClientId);
  }

  get selectedClientOrders(): Order[] {
    return this.orders.filter((order) => order.customerId === this.selectedClientId);
  }

  get clientNameInvalid(): boolean {
    return /\d/.test(this.clientForm.name.trim());
  }

  validateClientName(value: string): void {
    const trimmed = value.trim();
    this.clientNameError = /\d/.test(trimmed)
      ? 'Valor no válido: el nombre no puede contener números.'
      : '';
  }

  get phoneInvalid(): boolean {
    return !!this.phoneError || (!!this.clientForm.phone.trim() && !/^\d{4}-?\d{0,6}$/.test(this.clientForm.phone.trim()));
  }

  formatPhoneInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;

    this.clientForm.phone = formatted;
    this.phoneError = /[a-zA-Z]/.test(value)
      ? 'Valor no válido: el teléfono solo puede tener números.'
      : '';
  }

  createClient(): void {
    if (!this.clientForm.name || !this.clientForm.phone || !this.clientForm.address) {
      this.clientError = 'Completá nombre, teléfono y dirección del cliente.';
      return;
    }

    if (this.clientNameInvalid) {
      this.clientError = 'Valor no válido: el nombre del cliente no puede contener números.';
      return;
    }

    const phone = this.clientForm.phone.trim();
    if (!/^\d{4}-\d{6}$/.test(phone)) {
      this.clientError = 'Teléfono inválido. Usá el formato 3462-683521.';
      return;
    }

    this.clientSubmitting = true;
    this.clientError = '';
    this.clientSuccess = '';

    const payload: ClientPayload = {
      name: this.clientForm.name.trim(),
      phone,
      address: this.clientForm.address.trim()
    };

    this.clientsService.createClient(payload)
      .pipe(finalize(() => {
        this.clientSubmitting = false;
      }))
      .subscribe({
        next: () => {
          this.clientSuccess = 'Cliente registrado correctamente.';
          this.clientForm = { name: '', phone: '', address: '' };
          this.loadClients();
        },
        error: (err) => {
          const message = err?.error?.message || 'No se pudo registrar el cliente.';
          this.clientError = message;
        }
      });
  }

  deleteClient(client: Client): void {
    if (!client._id) {
      return;
    }

    this.clientsService.deleteClient(client._id).subscribe({
      next: () => {
        this.clientSuccess = 'Cliente eliminado.';
        if (this.selectedClientId === client._id) {
          this.selectedClientId = '';
          this.form.customerId = '';
        }
        this.loadClients();
        this.loadOrders();
      },
      error: () => {
        this.clientError = 'No se pudo eliminar el cliente.';
      }
    });
  }

  selectClient(clientId: string): void {
    this.selectedClientId = clientId;
    this.form.customerId = clientId;
    this.syncDerivedState();
  }

  statusClass(status: OrderStatus): string {
    switch (status) {
      case 'Recibido':
        return 'status-received';
      case 'Presupuestar':
        return 'status-budget';
      case 'En Reparación':
        return 'status-repair';
      case 'Finalizado':
        return 'status-finished';
      case 'Entregado':
        return 'status-delivered';
      case 'Por Garantía':
        return 'status-warranty';
      default:
        return 'status-received';
    }
  }

  private buildSummary(orders: Order[]) {
    const revenue = orders.reduce((sum, order) => sum + (order.budget ?? 0), 0);
    const avgBudget = orders.length > 0 ? revenue / orders.length : 0;

    return {
      total: orders.length,
      received: orders.filter((order) => order.status === 'Recibido').length,
      budget: orders.filter((order) => order.status === 'Presupuestar').length,
      repair: orders.filter((order) => order.status === 'En Reparación').length,
      delivered: orders.filter((order) => order.status === 'Entregado').length,
      warranty: orders.filter((order) => order.status === 'Por Garantía').length,
      revenue,
      avgBudget
    };
  }

  private buildReportRows(orders: Order[]) {
    return this.statusOptions.map((status) => ({
      label: status,
      count: orders.filter((order) => order.status === status).length
    }));
  }

  createOrder(): void {
    if (!this.form.customerId) {
      this.error = 'Seleccioná un cliente para asociar la orden.';
      return;
    }

    if (!this.form.deviceType || !this.form.brandModel || !this.form.serialNumber) {
      this.error = 'Completá tipo de equipo, marca/modelo y número de serie.';
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    this.ordersService
      .createOrder({
        customerId: this.form.customerId,
        deviceType: this.form.deviceType,
        brandModel: this.form.brandModel,
        serialNumber: this.form.serialNumber,
        passwordOrPattern: this.form.passwordOrPattern,
        reportedFailure: this.form.reportedFailure,
        status: this.form.status,
        budget: this.form.budget || 0,
        technicalNotes: this.form.technicalNotes
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.success = 'Orden creada correctamente.';
          this.form = {
            customerId: this.clients[0]?._id ?? '',
            deviceType: '',
            brandModel: '',
            serialNumber: '',
            passwordOrPattern: '',
            reportedFailure: '',
            status: 'Recibido',
            budget: 0,
            technicalNotes: ''
          };
          this.loadOrders();
        },
        error: () => {
          this.submitting = false;
          this.error = 'No se pudo registrar la orden.';
        }
      });
  }

  updateStatus(order: Order): void {
    if (!order._id) {
      return;
    }

    this.ordersService.updateOrder(order._id, { status: order.status }).subscribe({
      next: () => {
        this.success = 'Estado actualizado.';
      },
      error: () => {
        this.error = 'No se pudo actualizar el estado.';
      }
    });
  }

  deleteOrder(order: Order): void {
    if (!order._id) {
      return;
    }

    this.ordersService.deleteOrder(order._id).subscribe({
      next: () => {
        this.success = 'Orden eliminada.';
        this.loadOrders();
      },
      error: () => {
        this.error = 'No se pudo eliminar la orden.';
      }
    });
  }
}
