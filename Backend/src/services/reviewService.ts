import {
  ReviewRepository,
  type CreateReviewInput,
} from '../repositories/reviewRepository.ts';
import type { CreateReviewDto } from '../dtos/reviewDtos.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository()
  ) {
    this.reviewRepository = reviewRepository;
  }

  async getAllReviews() {
    return await this.reviewRepository.findAll();
  }

  async createReview(input: CreateReviewDto) {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('INVALID_RATING');
    }

    return await this.reviewRepository.create(input);
  }

  async deleteReview(id: number) {
    const review = await this.reviewRepository.remove(id);

    if (!review) {
      throw new Error('REVIEW_NOT_FOUND');
    }

    return review;
  }
}