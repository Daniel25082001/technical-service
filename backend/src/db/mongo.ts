import mongoose from "mongoose";

export const DATABASE_URL = "mongodb://localhost:27017/technical-service";

export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);

    console.log("MongoDB conectado");
  } catch (error) {
    console.log(error);
  }
};