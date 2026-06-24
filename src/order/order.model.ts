import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false,
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
    },
    technicalNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);