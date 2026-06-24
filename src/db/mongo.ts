import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/technical-service"
    );

    console.log("MongoDB conectado");
  } catch (error) {
    console.log(error);
  }
};