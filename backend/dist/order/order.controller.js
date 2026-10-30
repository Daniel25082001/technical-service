"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
const service = new order_service_1.OrderService();
class OrderController {
    async create(req, res) {
        try {
            const order = await service.create(req.body);
            res.status(201).json(order);
        }
        catch (error) {
            console.error("Error al crear la orden:", error);
            if (error.name === "ValidationError") {
                return res.status(400).json({ message: error.message, errors: error.errors });
            }
            return res.status(500).json({
                message: error?.message ||
                    (typeof error === "string" ? error : "Error al crear la orden"),
                details: error?.errors ||
                    (error && typeof error === "object" ? JSON.stringify(error) : undefined),
            });
        }
    }
    async findAll(req, res) {
        try {
            const orders = await service.findAll();
            res.json(orders);
        }
        catch {
            res.status(500).json({ message: "Error al obtener las órdenes" });
        }
    }
    async findById(req, res) {
        try {
            const order = await service.findById(req.params.id);
            if (!order) {
                res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json(order);
        }
        catch {
            res.status(500).json({ message: "Error al buscar la orden" });
        }
    }
    async update(req, res) {
        try {
            const order = await service.update(req.params.id, req.body);
            if (!order) {
                res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json(order);
        }
        catch {
            res.status(500).json({ message: "Error al actualizar la orden" });
        }
    }
    async delete(req, res) {
        try {
            const order = await service.delete(req.params.id);
            if (!order) {
                res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json({ message: "Orden eliminada" });
        }
        catch {
            res.status(500).json({ message: "Error al eliminar la orden" });
        }
    }
    async clientLookup(req, res) {
        const { orderId, phone } = req.body;
        try {
            const result = await service.clientLookup(orderId, phone);
            if (!result) {
                res.status(404).json({
                    message: "Los datos ingresados no corresponden a ninguna orden activa"
                });
                return;
            }
            res.json(result);
        }
        catch {
            res.status(500).json({ message: "Error al procesar la consulta" });
        }
    }
    async acceptBudget(req, res) {
        const { orderId, phone } = req.body;
        try {
            const updatedOrder = await service.confirmBudget(orderId, phone);
            if (!updatedOrder) {
                res.status(404).json({ message: "The provided data does not correspond to any active order" });
                return;
            }
            res.json({ message: "Presupuesto aprobado en pesos. El equipo pasó a reparación.", order: updatedOrder });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.OrderController = OrderController;
