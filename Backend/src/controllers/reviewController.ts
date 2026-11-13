import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(
    reviewService: ReviewService = new ReviewService()
  ) {
    this.reviewService = reviewService;
  }

  private handleError(res: Response, error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'REVIEW_NOT_FOUND'
    ) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review tidak ditemukan',
      });
    }

    if (
      error instanceof Error &&
      error.message === 'INVALID_RATING'
    ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Rating harus antara 1 sampai 5',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : error,
    });
  }

  getReviews = async (req: Request, res: Response) => {
    try {
      const data = await this.reviewService.getAllReviews();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createReview = async (req: Request, res: Response) => {
    try {
      const data = await this.reviewService.createReview(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Review berhasil dibuat',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await this.reviewService.deleteReview(id);

      return res.status(200).json({
        status: 'success',
        message: 'Review berhasil dihapus',
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}