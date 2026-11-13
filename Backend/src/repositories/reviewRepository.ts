import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users } from '../db/schema.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findAll() {
    const db = await getDb();

    return await db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id));
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.id, id));

    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();

    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });

    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();

    const rows = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .output();

    return rows[0];
  }
}