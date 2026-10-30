"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_model_1 = __importDefault(require("./order.model"));
class OrderRepository {
    async create(data) {
        return await order_model_1.default.create(data);
    }
    async findAll() {
        return await order_model_1.default.find();
    }
    async findById(id) {
        return await order_model_1.default.findById(id);
    }
    async update(id, data) {
        return await order_model_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await order_model_1.default.findByIdAndDelete(id);
    }
    async findByOrderAndPhone(orderId) {
        return await order_model_1.default.findById(orderId);
    }
    async countByCustomerAndStatuses(customerId, statuses) {
        return await order_model_1.default.countDocuments({
            customerId,
            status: { $in: statuses }
        });
    }
}
exports.OrderRepository = OrderRepository;
