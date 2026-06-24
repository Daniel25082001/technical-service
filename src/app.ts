import express from "express";
import clientRoutes from "./client/client.routes";

const app = express();

app.use(express.json());

app.use("/clients", clientRoutes);

export default app;