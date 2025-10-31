import httpStatus from "http-status";
import AppError from "./app.error";

export default class UnprocessableError extends AppError {
    errors: any[];

    constructor(message?: string, errors?: any[]) {
        super(httpStatus.UNPROCESSABLE_ENTITY, message ?? "One or more fields contain invalid values");
        this.errors = errors || [];
    }
}