import app from "./app";
import { connectDB } from "./db/mongo";

const PORT = 3000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();