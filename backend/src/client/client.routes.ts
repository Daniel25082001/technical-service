import { Router } from "express";
import { ClientController } from "./client.controller";

const router = Router();
const controller =
  new ClientController();

router.post(
  "/",
  controller.create
);

router.get(
  "/",
  controller.findAll
);

router.get(
  "/:id",
  controller.findById
);

router.put(
  "/:id",
  controller.update
);

router.delete(
  "/:id",
  controller.delete
);

export default router;