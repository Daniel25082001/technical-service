export type OrderStatus =
  | 'Recibido'
  | 'Presupuestar'
  | 'En Reparación'
  | 'Finalizado'
  | 'Entregado'
  | 'Por Garantía';

export interface Order {
  _id?: string;
  customerId?: string;
  deviceType: string;
  brandModel: string;
  serialNumber: string;
  passwordOrPattern: string;
  reportedFailure: string;
  status: OrderStatus;
  budget?: number;
  technicalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderPayload {
  customerId: string;
  deviceType: string;
  brandModel: string;
  serialNumber: string;
  passwordOrPattern: string;
  reportedFailure: string;
  status?: OrderStatus;
  budget?: number;
  technicalNotes?: string;
}
