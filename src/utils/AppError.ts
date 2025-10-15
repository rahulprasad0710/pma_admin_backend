import { ErrorType } from "../enums/Eums";

class AppError extends Error {
    statusCode: number;
    data: null;
    location: string | undefined;
    stack?: string | undefined;
    errorType: string;
    constructor(message: string, statusCode: number, type: ErrorType) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errorType = type;
        this.message = message;
        this.location = this?.stack
            ? this.stack.split("\n")[1].trim()
            : undefined;
        Error.captureStackTrace(this, this.constructor);

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
