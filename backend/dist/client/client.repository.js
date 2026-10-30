"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const client_model_1 = __importDefault(require("./client.model"));
class ClientRepository {
    async create(data) {
        return await client_model_1.default.create(data);
    }
    async findAll() {
        return await client_model_1.default.find();
    }
    async findById(id) {
        return await client_model_1.default.findById(id);
    }
    async update(id, data) {
        return await client_model_1.default.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return await client_model_1.default.findByIdAndDelete(id);
    }
}
exports.ClientRepository = ClientRepository;
