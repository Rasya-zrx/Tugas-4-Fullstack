export interface CreateReviewDto {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export interface ReviewResponseDto {
  id: number;
  stallId: number;
  userId: number;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}