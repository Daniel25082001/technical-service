import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: String,
    seq: {
      type: Number,
      default: -1,
    },
  },
  {
    versionKey: false,
  }
);

const Counter =
  mongoose.models.OrderCounter ||
  mongoose.model("OrderCounter", counterSchema);

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => /^[0-9]{8}$/.test(value),
        message: "_id debe tener exactamente 8 dígitos numéricos.",
      },
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) =>
          /^(?:[A-Z]\d{4}|[A-Z0-9]{8})$/.test(value),
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
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", async function () {
  const order = this as any;

  if (order.isNew && !order._id) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const generated = counter.seq
      .toString()
      .padStart(8, "0");

    order._id = generated;
  }
});

export default mongoose.model("Order", orderSchema);
