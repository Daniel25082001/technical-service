import { randomUUID } from 'crypto';
import { Client } from './client.entity';
import { ClientRepository } from './client.repository';

export class ClientService {
  private repository = new ClientRepository();

  public getAll(): Client[] {
    return this.repository.findAll();
  }

  public getById(id: string): Client | undefined {
    return this.repository.findById(id);
  }

  public create(
    name: string,
    phone: string,
    address: string
  ): Client {
    const client: Client = {
      id: randomUUID(),
      name,
      phone,
      address
    };

    return this.repository.save(client);
  }

  public update(
    id: string,
    name: string,
    phone: string,
    address: string
  ): Client | undefined {
    const client = this.repository.findById(id);

    if (!client) {
      return undefined;
    }

    const updatedClient: Client = {
      ...client,
      name,
      phone,
      address
    };

    return this.repository.update(
      id,
      updatedClient
    );
  }

  public delete(id: string): boolean {
    return this.repository.delete(id);
  }
}