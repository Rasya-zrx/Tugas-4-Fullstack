import { z } from "zod";

export const createStallReviewSchema = z.object({
  rating: z.number({ required_error: "rating wajib diisi" })
    .int("rating harus bilangan bulat")
    .min(1, "rating minimal 1")
    .max(5, "rating maksimal 5"),
  comment: z.string().trim().max(1000, "comment maksimal 1000 karakter").optional(),
}).strict({ message: "body hanya boleh berisi rating dan comment" });

export type CreateStallReviewInput = z.infer<typeof createStallReviewSchema>;
