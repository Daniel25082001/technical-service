import Client from "./client.model";

export class ClientRepository {
  async create(data: any) {
    return await Client.create(data);
  }

  async findAll() {
    return await Client.find();
  }

  async findById(id: string) {
    return await Client.findById(id);
  }

  async update(
    id: string,
    data: any
  ) {
    return await Client.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }

  async delete(id: string) {
    return await Client.findByIdAndDelete(id);
  }
}