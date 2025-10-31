import httpStatus from "http-status";
import AppError from "./app.error";

export default class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(httpStatus.FORBIDDEN, message ?? "You are not authorized to perform this action");
  }
}
