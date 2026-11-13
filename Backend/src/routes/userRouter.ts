import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();

const userController = new UserController();

userRouter.get('/', (req, res) =>
  userController.getUsers(req, res)
);

userRouter.post('/', (req, res) =>
  userController.createUser(req, res)
);

export { userRouter };  