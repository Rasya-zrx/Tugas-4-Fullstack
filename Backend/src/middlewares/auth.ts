import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError.ts";
import { AppError } from "../errors/AppError.ts";
import { ForbiddenError } from "../errors/ForbiddenError.ts";
import { verifyToken } from "../services/tokenService.ts";
import type { UserRole } from "../repositories/userRepository.ts";

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.header("authorization");
  if (!authorization) {
    return next(new UnauthorizedError("Token tidak ditemukan"));
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return next(new UnauthorizedError("Format token harus Bearer <token>"));
  }

  try {
    res.locals.authUser = verifyToken(match[1]);
    return next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError) {
      return next(new UnauthorizedError("Token tidak valid atau sudah kedaluwarsa"));
    }
    return next(error);
  }
};

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (_req, res, next) => {
    const user = res.locals.authUser as { role?: UserRole } | undefined;
    if (!user) return next(new UnauthorizedError());
    if (!user.role || !allowedRoles.includes(user.role)) {
      return next(new ForbiddenError());
    }
    return next();
  };
}
