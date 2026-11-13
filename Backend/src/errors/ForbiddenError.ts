import { AppError } from "./AppError.ts";

export class ForbiddenError extends AppError {
  constructor(message = "Kamu tidak memiliki akses untuk melakukan tindakan ini") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}
