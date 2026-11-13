import type { Request, Response } from "express";
import { ReviewService } from "../services/reviewService.ts";
import { StallService } from "../services/stallService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { AuthUser } from "../services/tokenService.ts";
import type { IdParam } from "../schemas/stallSchema.ts";
import type { CreateStallReviewInput } from "../schemas/reviewSchema.ts";

export class StallReviewController {
  constructor(
    private reviewService: ReviewService = new ReviewService(),
    private stallService: StallService = new StallService(),
  ) {}

  create = async (_req: Request, res: Response): Promise<void> => {
    const { id: stallId } = getValidated<IdParam>(res, "params");
    const body = getValidated<CreateStallReviewInput>(res, "body");
    const user = res.locals.authUser as AuthUser;

    await this.stallService.getStallById(stallId);
    const review = await this.reviewService.createReview({
      stallId,
      userId: user.id,
      rating: body.rating,
      comment: body.comment,
    });

    res.status(201).json({ status: "success", message: "Review berhasil dibuat", data: review });
  };
}
