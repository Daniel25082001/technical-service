import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../client.model';
import { ORDER_STATUSES, OrderStatus } from '../../order.model';

export interface OrderFormControls {
  // Controles tipados; presupuesto y notas admiten valores vacíos.
  customerId: FormControl<string>;
  deviceType: FormControl<string>;
  brandModel: FormControl<string>;
  serialNumber: FormControl<string>;
  passwordOrPattern: FormControl<string>;
  reportedFailure: FormControl<string>;
  status: FormControl<OrderStatus>;
  budget: FormControl<number | null>;
  technicalNotes: FormControl<string>;
}

export type OrderFormGroup = FormGroup<OrderFormControls>;

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  // El padre aporta datos y recibe acciones para mantener la lógica centralizada.
  readonly form = input.required<OrderFormGroup>();
  readonly clients = input.required<Client[]>();
  readonly editing = input(false);
  readonly saving = input(false);
  readonly save = output<void>();
  readonly cancel = output<void>();
  protected readonly statuses = ORDER_STATUSES;
}
