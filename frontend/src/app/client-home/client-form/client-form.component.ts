import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface ClientFormControls {
  // Cada control es string no nulo para simplificar lectura y envío del formulario.
  name: FormControl<string>;
  phone: FormControl<string>;
  locality: FormControl<string>;
  street: FormControl<string>;
  number: FormControl<string>;
  floor: FormControl<string>;
}

export type ClientFormGroup = FormGroup<ClientFormControls>;

@Component({
  // Selector usado por el template padre: <app-client-form>.
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  // Entradas: formulario compartido y estados para edición/carga.
  readonly form = input.required<ClientFormGroup>();
  readonly editing = input(false);
  readonly saving = input(false);
  // Salidas: avisan al padre que el usuario quiere guardar o cancelar.
  readonly save = output<void>();
  readonly cancel = output<void>();

  protected phoneHasError(): boolean {
    // Solo muestra el error luego de que el usuario haya interactuado con el campo.
    const phone = this.form().controls.phone;
    return phone.invalid && phone.touched;
  }

  protected formatPhone(event: Event): void {
    // Da formato al campo mientras se escribe y conserva la posición del cursor.
    const input = event.target as HTMLInputElement;
    const digitsBeforeCursor = input.value
      .slice(0, input.selectionStart ?? input.value.length)
      .replace(/\D/g, '').length;
    const formattedPhone = this.formatPhoneNumber(input.value);

    input.value = formattedPhone;
    this.form().controls.phone.setValue(formattedPhone);

    const cursorPosition = digitsBeforeCursor < 4 ? digitsBeforeCursor : digitsBeforeCursor + 1;
    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  private formatPhoneNumber(value: string): string {
    // Descarta caracteres no numéricos y limita el teléfono a diez dígitos.
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 4) {
      return digits.length === 4 ? `${digits}-` : digits;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
}
