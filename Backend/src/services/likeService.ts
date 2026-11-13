import {
  LikeRepository,
  type CreateLikeInput,
} from '../repositories/likeRepository.ts';

export class LikeService {

  private likeRepository: LikeRepository;

  constructor(
    likeRepository: LikeRepository = new LikeRepository()
  ) {
    this.likeRepository = likeRepository;
  }

  async createLike(input: CreateLikeInput) {

    const existingLike =
      await this.likeRepository.findByReviewAndUser(
        input.reviewId,
        input.userId
      );

    if (existingLike) {
      throw new Error('LIKE_ALREADY_EXISTS');
    }

    return await this.likeRepository.create(input);
  }

  async deleteLike(id: number) {

    const like = await this.likeRepository.remove(id);

    if (!like) {
      throw new Error('LIKE_NOT_FOUND');
    }

    return like;
  }
}