import express from "express";
import clientRoutes from "./client/client.routes";
import orderRoutes from "./order/order.routes";

const app = express();

app.use(express.json());

app.use("/clients", clientRoutes);
app.use("/orders", orderRoutes);

export default app;