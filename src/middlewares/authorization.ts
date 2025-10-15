import { NextFunction, Request, RequestHandler, Response } from "express";

import { ALL_PERMISSIONS } from "../enums/Permission";
import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { IUserInfo } from "../types/types";

type TAuthorizePayload = {
    permissionName: ALL_PERMISSIONS;
};

type AuthorizePermission = (_payload: TAuthorizePayload) => RequestHandler;

const authorizePermission: AuthorizePermission = ({
    permissionName,
}: TAuthorizePayload) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const user: IUserInfo = req.verifiedUser;

            if (!user) {
                throw new AppError(
                    "Unauthorized. Permission Error",
                    401,
                    ErrorType.UNAUTHORIZED_ERROR
                );
            }

            const permissions: string[] = user?.role?.permissions ?? [];

            console.log(
                "LOG: ~ authorizePermission ~ permissions:",
                permissionName
            );

            if (!permissions.includes(permissionName)) {
                throw new AppError(
                    "Forbidden: Missing permission",
                    403,
                    ErrorType.UNAUTHORIZED_ERROR
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authorizePermission;
