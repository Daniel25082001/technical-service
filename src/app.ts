import express from 'express';
import cors from 'cors';
import clientRoutes from './client/client.routes';

export class App {
  private app = express();

  constructor() {
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    this.app.use('/clients', clientRoutes);
  }

  public start() {
    this.app.listen(3000, () => {
      console.log('Servidor iniciado en puerto 3000');
    });
  }
}