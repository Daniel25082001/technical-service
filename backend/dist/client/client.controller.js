"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const client_model_1 = require("./client.model");
const client_service_1 = require("./client.service");
const service = new client_service_1.ClientService();
class ClientController {
    async create(req, res) {
        try {
            const client = await service.create(req.body);
            return res.status(201).json(client);
        }
        catch (error) {
            if (error instanceof client_model_1.ClientIdCapacityError) {
                return res.status(409).json({
                    message: error.message,
                });
            }
            if (error.name === "ValidationError" ||
                error.code === 11000) {
                return res.status(400).json({
                    message: error.message ||
                        "Datos inválidos para crear el cliente.",
                });
            }
            return res.status(500).json({
                message: "Error creating client",
            });
        }
    }
    async findAll(req, res) {
        const clients = await service.findAll();
        return res.json(clients);
    }
    async findById(req, res) {
        const client = await service.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        return res.json(client);
    }
    async update(req, res) {
        try {
            const client = await service.update(req.params.id, req.body);
            if (!client) {
                return res.status(404).json({
                    message: "Client not found",
                });
            }
            return res.json(client);
        }
        catch (error) {
            if (error.name === "ValidationError" ||
                error.code === 11000) {
                return res.status(400).json({
                    message: error.message ||
                        "Datos inválidos para actualizar el cliente.",
                });
            }
            return res.status(500).json({
                message: "Error updating client",
            });
        }
    }
    async delete(req, res) {
        const client = await service.delete(req.params.id);
        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        return res
            .status(204)
            .send();
    }
}
exports.ClientController = ClientController;
