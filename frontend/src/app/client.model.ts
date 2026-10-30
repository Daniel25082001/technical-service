export interface Client {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientPayload {
  name: string;
  phone: string;
  address: string;
}
