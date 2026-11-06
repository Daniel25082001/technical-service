"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientIdCapacityError = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ClientIdCapacityError extends Error {
    constructor() {
        super("Se alcanzó el límite de identificadores de clientes (Z9999).");
        this.name = "ClientIdCapacityError";
    }
}
exports.ClientIdCapacityError = ClientIdCapacityError;
const counterSchema = new mongoose_1.default.Schema({
    _id: String,
    seq: Number,
}, { versionKey: false });
const ClientCounter = mongoose_1.default.models.ClientCounter ||
    mongoose_1.default.model("ClientCounter", counterSchema);
const generateClientId = async () => {
    const counter = await ClientCounter.findOneAndUpdate({ _id: "clientId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    const sequence = counter.seq;
    const sequencePerLetter = 9999;
    const letterIndex = Math.floor((sequence - 1) / sequencePerLetter);
    if (letterIndex >= 26) {
        throw new ClientIdCapacityError();
    }
    const letter = String.fromCharCode("A".charCodeAt(0) + letterIndex);
    const number = ((sequence - 1) % sequencePerLetter) + 1;
    return `${letter}${number.toString().padStart(4, "0")}`;
};
const clientSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => /^(\d{4}-\d{6}|\d{10})$/.test(value),
            message: "El número de teléfono debe tener formato 3462-683521.",
        },
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
clientSchema.pre("save", async function () {
    if (this.isNew) {
        this._id = await generateClientId();
    }
});
exports.default = mongoose_1.default.model("Client", clientSchema);
