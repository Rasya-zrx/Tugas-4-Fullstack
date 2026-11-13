import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, reviews, users } from '../db/schema.ts';

export class FlagRepository {
  async findAll() {
    const db = await getDb();

    return await db
      .select({
        id: flags.id,
        reviewId: flags.reviewId,
        reportedBy: flags.reportedBy,
        reason: flags.reason,
        status: flags.status,
        createdAt: flags.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(flags)
      .innerJoin(users, eq(flags.reportedBy, users.id));
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(flags)
      .where(eq(flags.id, id));

    return rows[0];
  }

  async updateStatus(id: number, status: string) {
    const db = await getDb();

    const rows = await db
      .update(flags)
      .set({
        status,
      })
      .where(eq(flags.id, id))
      .output();

    return rows[0];
  }
}