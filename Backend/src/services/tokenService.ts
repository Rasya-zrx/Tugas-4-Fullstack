import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/AppError.ts";
import type { UserRole } from "../repositories/userRepository.ts";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new AppError(500, "JWT_SECRET belum disetel atau terlalu pendek (minimal 32 karakter)");
  }
  return secret;
}

function getExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.JWT_EXPIRES_IN ?? "2h") as SignOptions["expiresIn"];
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { sub: String(user.id), name: user.name, email: user.email, role: user.role },
    getJwtSecret(),
    { algorithm: "HS256", expiresIn: getExpiresIn() },
  );
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });

  if (typeof payload === "string") {
    throw new jwt.JsonWebTokenError("Payload token tidak valid");
  }

  const id = Number(payload.sub);
  const name = payload.name;
  const email = payload.email;
  const role = payload.role;

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    !["admin", "owner", "customer"].includes(String(role))
  ) {
    throw new jwt.JsonWebTokenError("Payload token tidak valid");
  }

  return { id, name, email, role: role as UserRole };
}
