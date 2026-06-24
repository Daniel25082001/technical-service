import { OrderRepository } from "./order.repository";

export class OrderService {
  private repository = new OrderRepository();

  async create(data: any): Promise<any> {
    return await this.repository.create(data);
  }

  async findAll(): Promise<any> {
    return await this.repository.findAll();
  }

  async findById(id: any): Promise<any> {
    return await this.repository.findById(id);
  }

  async update(id: any, data: any): Promise<any> {
    return await this.repository.update(id, data);
  }

  async delete(id: any): Promise<any> {
    return await this.repository.delete(id);
  }

  async clientLookup(orderId: any, phone: any): Promise<any> {
    const order: any = await this.repository.findByOrderAndPhone(orderId);
    if (!order) return null;

    if (order.customerId && order.customerId.phone !== phone) {
      return null;
    }

    const activeStatuses = ["Recibido", "Presupuestar", "En Reparación", "Finalizado"];
    const equipmentCount = await this.repository.countByCustomerAndStatuses(
      order.customerId._id,
      activeStatuses
    );

    return {
      order,
      totalEquipmentsInInProcess: equipmentCount
    };
  }

  async confirmBudget(orderId: any, phone: any): Promise<any> {
    const lookup = await this.clientLookup(orderId, phone);
    if (!lookup) return null;

    if (lookup.order.status !== "Presupuestar") {
      throw new Error("La orden no está en estado para presupuestar o ya fue aceptada");
    }

    return await this.repository.update(orderId, { status: "En Reparación" });
  }
}