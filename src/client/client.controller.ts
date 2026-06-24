import { Request, Response } from "express";
import { ClientService } from "./client.service";

const service = new ClientService();

export class ClientController {
  async create(
    req: Request,
    res: Response
  ) {
    try {
      const client = await service.create(
        req.body
      );

      return res.status(201).json(client);
    } catch {
      return res.status(500).json({
        message: "Error creating client",
      });
    }
  }

  async findAll(
    req: Request,
    res: Response
  ) {
    const clients =
      await service.findAll();

    return res.json(clients);
  }

  async findById(
    req: Request,
    res: Response
  ) {
    const client =
      await service.findById(
        req.params.id as string
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.json(client);
  }

  async update(
    req: Request,
    res: Response
  ) {
    const client =
      await service.update(
        req.params.id as string,
        req.body
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.json(client);
  }

  async delete(
    req: Request,
    res: Response
  ) {
    const client =
      await service.delete(
        req.params.id as string
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res
      .status(204)
      .send();
  }
}