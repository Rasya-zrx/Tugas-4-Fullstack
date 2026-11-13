import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();

const flagController = new FlagController();

flagRouter.get('/', (req, res) =>
  flagController.getFlags(req, res)
);

flagRouter.put('/:id', (req, res) =>
  flagController.updateFlagStatus(req, res)
);

export { flagRouter };