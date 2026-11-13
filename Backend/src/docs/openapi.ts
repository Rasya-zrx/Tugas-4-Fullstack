
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registerSchema, loginSchema } from "../schemas/authSchema.ts";
import { createStallSchema, idParamSchema, stallQuerySchema, updateStallSchema } from "../schemas/stallSchema.ts";
import { createStallReviewSchema } from "../schemas/reviewSchema.ts";

const registry = new OpenAPIRegistry();

const authUserSchema = registry.register("AuthUser", z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "owner", "customer"]),
}));

const stallSchema = registry.register("Stall", z.object({
  id: z.number(),
  ownerId: z.number(),
  name: z.string(),
  category: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  avgRating: z.number(),
  reviewCount: z.number(),
  isPopular: z.boolean(),
}));

const errorSchema = registry.register("ErrorResponse", z.object({
  status: z.string().openapi({ example: "fail" }),
  message: z.string().openapi({ example: "Validasi gagal" }),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
}));

const stallResponse = z.object({ status: z.literal("success"), data: stallSchema });
const registerResponse = z.object({
  status: z.literal("success"),
  data: z.object({ user: authUserSchema }),
});
const loginResponse = z.object({
  status: z.literal("success"),
  data: z.object({
    token: z.string(),
    tokenType: z.literal("Bearer"),
    expiresIn: z.string(),
    user: authUserSchema,
  }),
});

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const json = (schema: z.ZodTypeAny) => ({
  "application/json": { schema },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Register akun",
  request: { body: { required: true, content: json(registerSchema) } },
  responses: {
    201: { description: "Akun dibuat", content: json(registerResponse) },
    400: { description: "Validasi gagal", content: json(errorSchema) },
    409: { description: "Email sudah terdaftar", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Login dan mendapatkan JWT",
  request: { body: { required: true, content: json(loginSchema) } },
  responses: {
    200: { description: "Login berhasil", content: json(loginResponse) },
    400: { description: "Validasi gagal", content: json(errorSchema) },
    401: { description: "Email/password salah", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/me",
  summary: "Profil pengguna dari token",
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Profil login",
      content: json(z.object({
        status: z.literal("success"),
        data: z.object({ user: authUserSchema }),
      })),
    },
    401: { description: "Token tidak ada/tidak valid", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Cek koneksi server dan database",
  responses: { 200: { description: "Server aktif" } },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls",
  summary: "Daftar warung dengan filter dan pagination",
  request: { query: stallQuerySchema },
  responses: {
    200: {
      description: "Daftar warung",
      content: json(z.object({
        status: z.literal("success"),
        meta: z.object({ page: z.number(), limit: z.number(), total: z.number() }),
        data: z.array(stallSchema),
      })),
    },
    400: { description: "Query tidak valid", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls/{id}",
  summary: "Detail warung",
  request: { params: idParamSchema },
  responses: {
    200: { description: "Detail warung", content: json(stallResponse) },
    400: { description: "ID tidak valid", content: json(errorSchema) },
    404: { description: "Warung tidak ditemukan", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stalls",
  summary: "Tambah warung (owner/admin)",
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { required: true, content: json(createStallSchema) } },
  responses: {
    201: { description: "Warung dibuat", content: json(stallResponse) },
    400: { description: "Validasi gagal", content: json(errorSchema) },
    401: { description: "Belum login", content: json(errorSchema) },
    403: { description: "Role tidak diizinkan", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/stalls/{id}",
  summary: "Ubah warung (owner miliknya/admin)",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: idParamSchema,
    body: { required: true, content: json(updateStallSchema) },
  },
  responses: {
    200: { description: "Warung diubah", content: json(stallResponse) },
    400: { description: "Validasi gagal", content: json(errorSchema) },
    401: { description: "Belum login", content: json(errorSchema) },
    403: { description: "Tidak boleh mengubah warung orang lain", content: json(errorSchema) },
    404: { description: "Warung tidak ditemukan", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/stalls/{id}",
  summary: "Hapus warung (admin)",
  security: [{ [bearerAuth.name]: [] }],
  request: { params: idParamSchema },
  responses: {
    200: { description: "Warung dihapus", content: json(stallResponse) },
    401: { description: "Belum login", content: json(errorSchema) },
    403: { description: "Hanya admin", content: json(errorSchema) },
    404: { description: "Warung tidak ditemukan", content: json(errorSchema) },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stalls/{id}/reviews",
  summary: "Tambah review (semua role login)",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: idParamSchema,
    body: { required: true, content: json(createStallReviewSchema) },
  },
  responses: {
    201: { description: "Review dibuat" },
    400: { description: "Validasi gagal", content: json(errorSchema) },
    401: { description: "Belum login", content: json(errorSchema) },
    404: { description: "Warung tidak ditemukan", content: json(errorSchema) },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Review Kantin API",
    version: "1.0.0",
    description: "API Tugas 3: validasi Zod, error handling, JWT, dan otorisasi role.",
  },
  servers: [{ url: "http://localhost:3000" }],
});
