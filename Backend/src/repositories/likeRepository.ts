import { eq, and } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {

  async findByReviewAndUser(
    reviewId: number,
    userId: number
  ) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.reviewId, reviewId),
          eq(likes.userId, userId)
        )
      );

    return rows[0];
  }

  async create(input: CreateLikeInput) {
    const db = await getDb();

    await db
      .insert(likes)
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
        createdAt: new Date(),
      });

    // Ambil kembali data yang baru dibuat
    const rows = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.reviewId, input.reviewId),
          eq(likes.userId, input.userId)
        )
      );

    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();

    const existing = await db
      .select()
      .from(likes)
      .where(eq(likes.id, id));

    if (!existing[0]) {
      return undefined;
    }

    await db
      .delete(likes)
      .where(eq(likes.id, id));

    return existing[0];
  }
}