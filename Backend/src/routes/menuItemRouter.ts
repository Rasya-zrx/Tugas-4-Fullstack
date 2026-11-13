import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();

const menuItemController =
  new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.post('/', (req, res) => {
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };