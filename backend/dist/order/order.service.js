"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_repository_1 = require("./order.repository");
class OrderService {
    constructor() {
        this.repository = new order_repository_1.OrderRepository();
    }
    async create(data) {
        return await this.repository.create(data);
    }
    async findAll() {
        return await this.repository.findAll();
    }
    async findById(id) {
        return await this.repository.findById(id);
    }
    async update(id, data) {
        return await this.repository.update(id, data);
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
    async clientLookup(orderId, phone) {
        const order = await this.repository.findByOrderAndPhone(orderId);
        if (!order)
            return null;
        return { order };
    }
    async confirmBudget(orderId, phone) {
        const lookup = await this.clientLookup(orderId, phone);
        if (!lookup)
            return null;
        if (lookup.order.status !== "Presupuestar") {
            throw new Error("La orden no está en estado para presupuestar o ya fue aceptada");
        }
        return await this.repository.update(orderId, { status: "En Reparación" });
    }
}
exports.OrderService = OrderService;
