import { Router } from "express";
import { LikeController } from "../controllers/likeController.ts";

const likeRouter = Router();

const likeController = new LikeController();

likeRouter.post('/', (req, res) =>
  likeController.createLike(req, res)
);

likeRouter.delete('/:id', (req, res) =>
  likeController.deleteLike(req, res)
);

export { likeRouter };