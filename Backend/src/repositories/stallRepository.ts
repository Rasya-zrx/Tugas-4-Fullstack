import { and, count, eq, like, type SQL } from "drizzle-orm";
import { getDb } from "../db/index.ts";
import { stalls } from "../db/schema.ts";
import type { CreateStallInput, UpdateStallInput } from "../schemas/stallSchema.ts";

export interface FindAllParams {
  search?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface CreateStallRecord extends CreateStallInput {
  ownerId: number;
}

export class StallRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();
    const conditions: SQL[] = [];
    if (params.search) conditions.push(like(stalls.name, `%${params.search}%`));
    if (params.category) conditions.push(eq(stalls.category, params.category));
    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (params.page - 1) * params.limit;

    const rows = await db.select().from(stalls).where(where)
      .orderBy(stalls.id).offset(offset).fetch(params.limit);
    const totals = await db.select({ total: count() }).from(stalls).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(stalls).where(eq(stalls.id, id));
    return rows[0];
  }

  async create(input: CreateStallRecord) {
    const db = await getDb();
    const rows = await db.insert(stalls).output().values({
      ownerId: input.ownerId,
      name: input.name,
      category: input.category ?? null,
      location: input.location ?? null,
      description: input.description ?? null,
      avgRating: "0.00",
      reviewCount: 0,
    });
    return rows[0];
  }

  async update(id: number, input: UpdateStallInput) {
    const db = await getDb();
    const rows = await db.update(stalls).set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.location !== undefined ? { location: input.location } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    }).where(eq(stalls.id, id)).output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(stalls).where(eq(stalls.id, id)).output();
    return rows[0];
  }
}
