import { Client } from './client.entity';

export class ClientRepository {
  private clients: Client[] = [];

  public findAll(): Client[] {
    return this.clients;
  }

  public findById(id: string): Client | undefined {
    return this.clients.find(client => client.id === id);
  }

  public save(client: Client): Client {
    this.clients.push(client);
    return client;
  }

  public update(id: string, data: Client): Client | undefined {
    const index = this.clients.findIndex(
      client => client.id === id
    );

    if (index === -1) {
      return undefined;
    }

    this.clients[index] = data;

    return this.clients[index];
  }

  public delete(id: string): boolean {
    const index = this.clients.findIndex(
      client => client.id === id
    );

    if (index === -1) {
      return false;
    }

    this.clients.splice(index, 1);

    return true;
  }
}