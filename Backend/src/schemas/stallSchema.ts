import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "id harus berupa angka" })
    .int("id harus bilangan bulat")
    .positive("id harus lebih dari 0")
    .openapi({ example: 3, description: "ID warung" }),
});

export const stallQuerySchema = z.object({
  search: z.string().trim().max(100, "search maksimal 100 karakter").optional()
    .openapi({ description: "Cari berdasarkan nama warung" }),
  category: z.string().trim().max(50, "category maksimal 50 karakter").optional()
    .openapi({ description: "Filter kategori warung" }),
  page: z.coerce.number({ invalid_type_error: "page harus berupa angka" })
    .int("page harus bilangan bulat")
    .min(1, "page minimal 1")
    .default(1)
    .openapi({ description: "Nomor halaman (default 1)", example: 1 }),
  limit: z.coerce.number({ invalid_type_error: "limit harus berupa angka" })
    .int("limit harus bilangan bulat")
    .min(1, "limit minimal 1")
    .max(100, "limit maksimal 100")
    .default(10)
    .openapi({ description: "Jumlah data per halaman (maks 100)", example: 10 }),
});

export const createStallSchema = z.object({
  name: z.string({ required_error: "name wajib diisi" })
    .trim()
    .min(3, "name minimal 3 karakter")
    .max(100, "name maksimal 100 karakter")
    .openapi({ example: "Warung Baru" }),
  category: z.string().trim().max(50, "category maksimal 50 karakter").optional()
    .openapi({ example: "Nasi" }),
  location: z.string().trim().max(100, "location maksimal 100 karakter").optional()
    .openapi({ example: "Kantin FK" }),
  description: z.string().trim().max(1000, "description maksimal 1000 karakter").optional()
    .openapi({ example: "Nasi goreng dadakan" }),
}).strict({ message: "body hanya boleh berisi name, category, location, dan description" });

export const updateStallSchema = createStallSchema.partial()
  .strict({ message: "body hanya boleh berisi name, category, location, dan description" });

export type IdParam = z.infer<typeof idParamSchema>;
export type StallQuery = z.infer<typeof stallQuerySchema>;
export type CreateStallInput = z.infer<typeof createStallSchema>;
export type UpdateStallInput = z.infer<typeof updateStallSchema>;
