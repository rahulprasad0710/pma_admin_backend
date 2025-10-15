import { NextFunction, Request, Response } from "express";

import APP_CONSTANT from "../constants/AppConfig";
import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { Socket } from "socket.io";
import { User } from "../db/entity/User";
import UserService from "../services/users.service";
import authService from "../services/auth.service";
import jwt from "jsonwebtoken";

const userService = new UserService();

declare module "socket.io" {
    interface Socket {
        verifiedUserId?: number;
    }
}
const decodeToken = async (token: string): Promise<number> => {
    try {
        const decoded = jwt.verify(
            token,
            APP_CONSTANT.JWT_ACCESS_SECRET as string
        );

        // Check if token is decoded and has an id
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("id" in decoded)
        ) {
            throw new AppError(
                "Invalid token payload",
                401,
                ErrorType.AUTH_ERROR
            );
        }

        return Number(decoded.id);
    } catch (error: unknown) {
        console.log("LOG: ~ decodeToken ~ error:", error);
        if (typeof error === "object" && error !== null && "name" in error) {
            const name = (error as { name: string }).name;

            if (name === "TokenExpiredError") {
                throw new AppError(
                    "Token has expired",
                    401,
                    ErrorType.EXPIRED_TOKEN_ERROR
                );
            }

            if (name === "JsonWebTokenError") {
                throw new AppError("Invalid token", 401, ErrorType.AUTH_ERROR);
            }
        }

        throw new AppError("Authentication failed", 401, ErrorType.AUTH_ERROR);
    }
};
const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
                data: null,
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                error: "Access Denied",
                data: null,
            });
            return;
        }

        const userId = await decodeToken(token);

        const user = await authService.authenticateUser(userId, true);
        console.log("LOG: ~ verifyToken ~ user:", user);

        if (!user) {
            res.status(401).json({
                success: false,
                error: "Invalid Token",
                data: null,
            });
            return;
        }

        req.verifiedUserId = user?.id;
        req.verifiedUser = user;
        next();
    } catch (error) {
        next(error);
    }
};

// const verifyFromCredentials = async (userId: number): Promise<User | null> => {
//     const userFromDB = await userService.getById(userId);
//     return userFromDB;
// };

export const socketAuth = async (
    socket: Socket,
    next: (err?: Error) => void
) => {
    try {
        const authHeader = socket.handshake.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new Error("Unauthorized"));
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new Error("Unauthorized: Missing token"));
        }

        const decodedUser = await decodeToken(token);
        console.log("LOG: ~ socketAuth ~ decodedUser:", decodedUser);
        if (!decodedUser) {
            return next(new Error("Authentication error"));
        }
        socket.verifiedUserId = decodedUser;
        next();
    } catch (error) {
        console.error("Socket auth error:", error);

        next(new Error("Authentication error"));
    }
};
export default verifyToken;
