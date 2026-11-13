import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, users } from '../db/schema.ts';

export interface CreateAuditLogInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export class AuditRepository {
  async findAll() {
    const db = await getDb();

    return await db
      .select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        action: auditLogs.action,
        targetTable: auditLogs.targetTable,
        targetId: auditLogs.targetId,
        metadata: auditLogs.metadata,
        createdAt: auditLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(auditLogs)
      .innerJoin(users, eq(auditLogs.userId, users.id));
  }

  async create(input: CreateAuditLogInput) {
    const db = await getDb();

    const rows = await db
      .insert(auditLogs)
      .output()
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata ?? null,
      });

    return rows[0];
  }
}