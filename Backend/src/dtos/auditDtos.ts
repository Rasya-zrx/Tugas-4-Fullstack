export interface CreateAuditLogDto {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}