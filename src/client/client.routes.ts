import { Router } from 'express';
import { ClientController } from './client.controller';

const router = Router();
const controller = new ClientController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;