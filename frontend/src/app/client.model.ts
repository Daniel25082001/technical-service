export interface Client {
  _id: string;
  name: string;
  phone: string;
  address: string;
}

export type ClientInput = Pick<Client, 'name' | 'phone' | 'address'>;
