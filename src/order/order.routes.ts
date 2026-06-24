import { Router } from "express";
import { OrderController } from "./order.controller";

const orderRouter = Router();
const controller = new OrderController();

orderRouter.post("/", controller.create);
orderRouter.get("/", controller.findAll);
orderRouter.get("/:id", controller.findById);
orderRouter.put("/:id", controller.update);
orderRouter.delete("/:id", controller.delete);

orderRouter.post("/lookup", controller.clientLookup);
orderRouter.post("/accept-budget", controller.acceptBudget);

export default orderRouter;