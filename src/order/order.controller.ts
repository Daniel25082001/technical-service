import { OrderService } from "./order.service";

const service = new OrderService();

export class OrderController {
  async create(req: any, res: any): Promise<void> {
    try {
      const order = await service.create(req.body);
      res.status(201).json(order);
    } catch {
      res.status(500).json({ message: "Error al crear la orden" });
    }
  }

  async findAll(req: any, res: any): Promise<void> {
    try {
      const orders = await service.findAll();
      res.json(orders);
    } catch {
      res.status(500).json({ message: "Error al obtener las órdenes" });
    }
  }

  async findById(req: any, res: any): Promise<void> {
    try {
      const order = await service.findById(req.params.id);
      if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }
      res.json(order);
    } catch {
      res.status(500).json({ message: "Error al buscar la orden" });
    }
  }

  async update(req: any, res: any): Promise<void> {
    try {
      const order = await service.update(req.params.id, req.body);
      if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }
      res.json(order);
    } catch {
      res.status(500).json({ message: "Error al actualizar la orden" });
    }
  }

  async delete(req: any, res: any): Promise<void> {
    try {
      const order = await service.delete(req.params.id);
      if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Error al eliminar la orden" });
    }
  }

  async clientLookup(req: any, res: any): Promise<void> {
    const { orderId, phone } = req.body;
    try {
      const result = await service.clientLookup(orderId, phone);
      if (!result) {
        res.status(404).json({ 
          message: "Los datos ingresados no corresponden a ninguna orden activa" 
        });
        return;
      }
      res.json(result);
    } catch {
      res.status(500).json({ message: "Error al procesar la consulta" });
    }
  }

  async acceptBudget(req: any, res: any): Promise<void> {
    const { orderId, phone } = req.body;
    try {
      const updatedOrder = await service.confirmBudget(orderId, phone);
      if (!updatedOrder) {
        res.status(404).json({ message: "No se pudo procesar la aprobación" });
        return;
      }
      res.json({ message: "Presupuesto aprobado. El equipo pasó a reparación.", order: updatedOrder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}