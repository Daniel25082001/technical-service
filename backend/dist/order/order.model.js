"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    _id: String,
    seq: {
        type: Number,
        default: -1,
    },
}, {
    versionKey: false,
});
const Counter = mongoose_1.default.models.OrderCounter ||
    mongoose_1.default.model("OrderCounter", counterSchema);
const orderSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => /^[0-9]{8}$/.test(value),
            message: "_id debe tener exactamente 8 dígitos numéricos.",
        },
    },
    customerId: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => /^[A-Z0-9]{8}$/.test(value),
            message: "customerId debe ser un identificador de cliente válido.",
        },
    },
    deviceType: {
        type: String,
        required: true,
        trim: true,
    },
    brandModel: {
        type: String,
        required: true,
        trim: true,
    },
    serialNumber: {
        type: String,
        required: true,
        trim: true,
    },
    passwordOrPattern: {
        type: String,
        required: true,
    },
    reportedFailure: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Recibido", "Presupuestar", "En Reparación", "Finalizado", "Entregado", "Por Garantía"],
        default: "Recibido",
    },
    budget: {
        type: Number,
        min: 0,
    },
    technicalNotes: {
        type: String,
    },
}, {
    timestamps: true,
});
orderSchema.pre("validate", async function () {
    const order = this;
    if (order.isNew && !order._id) {
        const counter = await Counter.findOneAndUpdate({ _id: "orderId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const generated = counter.seq
            .toString()
            .padStart(8, "0");
        order._id = generated;
    }
});
exports.default = mongoose_1.default.model("Order", orderSchema);
