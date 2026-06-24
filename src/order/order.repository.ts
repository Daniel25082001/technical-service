import Order from "./order.model";

export class OrderRepository {
  async create(data: any): Promise<any> {
    return await Order.create(data);
  }

  async findAll(): Promise<any> {
    return await Order.find().populate("customerId");
  }

  async findById(id: any): Promise<any> {
    return await Order.findById(id).populate("customerId");
  }

  async update(id: any, data: any): Promise<any> {
    return await Order.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: any): Promise<any> {
    return await Order.findByIdAndDelete(id);
  }

  async findByOrderAndPhone(orderId: any): Promise<any> {
    return await Order.findById(orderId).populate("customerId");
  }

  async countByCustomerAndStatuses(customerId: any, statuses: any[]): Promise<number> {
    return await Order.countDocuments({
      customerId,
      status: { $in: statuses }
    });
  }
}