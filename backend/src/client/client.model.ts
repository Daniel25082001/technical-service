import mongoose from "mongoose";

export class ClientIdCapacityError extends Error {
  constructor() {
    super("Se alcanzó el límite de identificadores de clientes (Z9999).");
    this.name = "ClientIdCapacityError";
  }
}

const counterSchema = new mongoose.Schema(
  {
    _id: String,
    seq: Number,
  },
  { versionKey: false }
);

const ClientCounter =
  mongoose.models.ClientCounter ||
  mongoose.model("ClientCounter", counterSchema);

const generateClientId = async (): Promise<string> => {
  const counter = await ClientCounter.findOneAndUpdate(
    { _id: "clientId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
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

const clientSchema = new mongoose.Schema(
  {
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
        validator: (value: string) => /^(\d{4}-\d{6}|\d{10})$/.test(value),
        message: "El número de teléfono debe tener formato 3462-123456.",
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

clientSchema.pre("save", async function () {
  if (this.isNew) {
    this._id = await generateClientId();
  }
});

export default mongoose.model(
  "Client",
  clientSchema
);