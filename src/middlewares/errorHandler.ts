import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError";

const errorHandler = (
    err: unknown | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error("Error:", err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            data: null,
            message: err.message,
            type: err.errorType,
            devMessage: "App Error",
            info: err.stack,
        });
    } else {
        res.status(500).json({
            success: false,
            data: null,
            message: "Something went wrong.",
            type: "Internal Server Error",
            devMessage: err instanceof Error ? err.message : String(err),
            info:
                err instanceof Error
                    ? {
                          name: err.name,
                          message: err.message,
                          stack: err.stack,
                      }
                    : undefined,
        });
    }
};

export default errorHandler;
