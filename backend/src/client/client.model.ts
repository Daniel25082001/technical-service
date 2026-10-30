import mongoose from "mongoose";

const generateClientId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const clientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: generateClientId,
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
        validator: (value: string) => /^(\d{4}-\d{6}|\d{10})$/.test(value),
        message: "El número de teléfono debe tener formato 3462-683521.",
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Client",
  clientSchema
);