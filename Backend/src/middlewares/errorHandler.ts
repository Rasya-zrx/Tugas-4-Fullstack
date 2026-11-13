import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.ts";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const bodyError = error as SyntaxError & { status?: number; type?: string };
  if (
    error instanceof SyntaxError &&
    bodyError.status === 400 &&
    bodyError.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      status: "fail",
      message: "JSON pada body tidak valid",
      errors: [{ field: "body", message: "Format JSON tidak valid" }],
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "fail",
      message: error.message,
      ...(Array.isArray(error.details) ? { errors: error.details } : {}),
    });
    return;
  }

  const dbError = error as { number?: number };
  if (dbError.number === 2627) {
    res.status(409).json({ status: "fail", message: "Email sudah terdaftar" });
    return;
  }
  if (dbError.number === 547) {
    res.status(409).json({ status: "fail", message: "Data terkait masih digunakan atau tidak valid" });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server" });
};
