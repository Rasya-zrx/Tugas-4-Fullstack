import { Router } from "express";
import { StallController } from "../controllers/stallController.ts";
import { StallReviewController } from "../controllers/stallReviewController.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate, authorize } from "../middlewares/auth.ts";
import { createStallSchema, idParamSchema, stallQuerySchema, updateStallSchema } from "../schemas/stallSchema.ts";
import { createStallReviewSchema } from "../schemas/reviewSchema.ts";

const stallRouter = Router();
const stallController = new StallController();
const stallReviewController = new StallReviewController();

stallRouter.get("/", validate(stallQuerySchema, "query"), stallController.getStalls);
stallRouter.get("/:id", validate(idParamSchema, "params"), stallController.getStallById);
stallRouter.get("/:id/menus", validate(idParamSchema, "params"), stallController.getStallMenus);

stallRouter.post(
  "/",
  authenticate,
  authorize("owner", "admin"),
  validate(createStallSchema, "body"),
  stallController.createStall,
);

stallRouter.put(
  "/:id",
  authenticate,
  authorize("owner", "admin"),
  validate(idParamSchema, "params"),
  validate(updateStallSchema, "body"),
  stallController.updateStall,
);

stallRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  stallController.deleteStall,
);

stallRouter.post(
  "/:id/reviews",
  authenticate,
  validate(idParamSchema, "params"),
  validate(createStallReviewSchema, "body"),
  stallReviewController.create,
);

export { stallRouter };
