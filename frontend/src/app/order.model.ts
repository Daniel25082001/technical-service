// Estos estados deben coincidir con las opciones permitidas por el esquema de MongoDB.
export const ORDER_STATUSES = [
  'Recibido',
  'Presupuestar',
  'En Reparación',
  'Finalizado',
  'Entregado',
  'Por Garantía',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Forma de una orden que devuelve la API.
export interface Order {
  _id: string;
  customerId: string;
  deviceType: string;
  brandModel: string;
  serialNumber: string;
  passwordOrPattern: string;
  reportedFailure: string;
  status: OrderStatus;
  budget?: number;
  technicalNotes?: string;
}

// Al crear una orden no se envía _id: el backend genera sus 4 dígitos.
export type OrderInput = Omit<Order, '_id'>;
