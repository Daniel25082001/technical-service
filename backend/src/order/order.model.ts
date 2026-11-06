import mongoose from "mongoose";

export class OrderIdCapacityError extends Error {
  constructor() {
    super("Se alcanzó el límite de órdenes de cuatro cifras (9999).");
    this.name = "OrderIdCapacityError";
  }
}

const counterSchema = new mongoose.Schema(
  {
    _id: String,
    seq: Number,
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
        validator: (value: string) => /^\d{4}$/.test(value),
        message: "_id debe tener exactamente 4 dígitos numéricos.",
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

  if (order.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter.seq > 9999) {
      throw new OrderIdCapacityError();
    }

    order._id = counter.seq.toString().padStart(4, "0");
  }
});

export default mongoose.model("Order", orderSchema);
