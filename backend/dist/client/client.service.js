"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const client_repository_1 = require("./client.repository");
class ClientService {
    constructor() {
        this.repository = new client_repository_1.ClientRepository();
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
}
exports.ClientService = ClientService;
