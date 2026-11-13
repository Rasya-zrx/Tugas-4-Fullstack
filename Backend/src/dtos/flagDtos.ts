export interface CreateFlagDto {
  reviewId: number;
  reportedBy: number;
  reason?: string | null;
  status: string;
}

export interface UpdateFlagStatusDto {
  status: string;
}