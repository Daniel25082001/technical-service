import { Request, Response } from 'express';
import { ClientService } from './client.service';

export class ClientController {
  private service = new ClientService();

  public getAll = (
    req: Request,
    res: Response
  ) => {
    const clients = this.service.getAll();

    res.json(clients);
  };

  public getById = (
    req: Request,
    res: Response
  ) => {
    const client = this.service.getById(
      req.params.id as string
    );

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    res.json(client);
  };

  public create = (
    req: Request,
    res: Response
  ) => {
    const { name, phone, address } = req.body;

    const client = this.service.create(
      name,
      phone,
      address
    );

    res.status(201).json(client);
  };

  public update = (
    req: Request,
    res: Response
  ) => {
    const { name, phone, address } = req.body;

    const client = this.service.update(
      req.params.id as string,
      name,
      phone,
      address
    );

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    res.json(client);
  };

  public delete = (
    req: Request,
    res: Response
  ) => {
    const deleted = this.service.delete(
      req.params.id as string
    );

    if (!deleted) {
      return res.status(404).json({
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      message: 'Cliente eliminado'
    });
  };
}