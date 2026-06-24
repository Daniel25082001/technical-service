import { ClientRepository } from "./client.repository";

export class ClientService {
  private repository =
    new ClientRepository();

  async create(data: any) {
    return await this.repository.create(
      data
    );
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    return await this.repository.findById(
      id
    );
  }

  async update(
    id: string,
    data: any
  ) {
    return await this.repository.update(
      id,
      data
    );
  }

  async delete(id: string) {
    return await this.repository.delete(
      id
    );
  }
}