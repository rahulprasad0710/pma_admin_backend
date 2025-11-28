import { IFeatureInfo, IUserInfo, TInternalCompany } from "../types/types";

import APP_CONSTANT from "../constants/AppConfig";
import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { RedisService } from "./config/redis.service";
import RoleService from "./role.service";
import UserService from "./users.service";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";

const userService = new UserService();
const roleService = new RoleService();

// ! # USER LOGGING IN WITH CREDENTIALS
const loginWithCredentials = async (email: string, password: string) => {
    const userFromDB = await userService.getByEmail(email);

    if (!userFromDB) {
        throw new AppError("User not found", 401, ErrorType.NOT_FOUND_ERROR);
    }

    const isPasswordCorrect = await checkPassword(
        password,
        userFromDB.password
    );

    if (!isPasswordCorrect) {
        throw new AppError(
            "Invalid user credentials",
            401,
            ErrorType.AUTH_ERROR
        );
    }

    if (!userFromDB.emailVerified) {
        throw new AppError("Email not verified", 401, ErrorType.AUTH_ERROR);
    }

    if (!userFromDB.isActive) {
        throw new AppError("User not active", 401, ErrorType.AUTH_ERROR);
    }

    const accessToken = generateToken.accessToken({
        userId: userFromDB?.id,
        userType: "credentials",
        loginType: "credentials",
    });

    const userInfo = await getUserInfo(userFromDB?.id);

    RedisService.setValue(`user:${userFromDB?.id}`, {
        id: userFromDB?.id,
        email: userFromDB?.email,
        type: "credentials",
        internalCompanies: userInfo?.internalCompanies,
        role: userInfo?.role,
        authenticated: true,
    });

    const refreshToken = generateToken.refreshToken({
        userId: userFromDB?.id,
        userType: "credentials",
        loginType: "credentials",
    });
    console.log({
        refreshToken,
    });
    await userService.updateRefreshToken(userFromDB.id, refreshToken);

    return {
        id: userFromDB?.id,
        email: userFromDB?.email,
        type: "credentials",
        internalCompanies: userInfo?.internalCompanies,
        role: {
            ...userInfo?.role,
            permissions: userInfo?.role?.permissions?.map((item) => {
                return item;
            }),
        },

        accessToken,
        refreshToken,
        authenticated: true,
    };
};

const logout = async (userId: number) => {
    RedisService.deleteKey(`user:${userId}`);

    await userService.updateRefreshToken(userId, undefined);

    return { id: userId, accessToken: null, refreshToken: null };
};

const checkPassword = async (enteredPassword: string, realPassword: string) => {
    const isPasswordCorrect = await bcrypt.compare(
        enteredPassword,
        realPassword
    );
    return isPasswordCorrect;
};

const verifyEmailAndSetPassword = async ({
    id,
    password,
    token,
}: {
    id: number;
    password: string;
    token: string;
}) => {
    if (!token)
        throw new AppError(
            "Invalid or expired token",
            400,
            ErrorType.AUTH_ERROR
        );

    const user = await userService.getById(id);
    if (!user) {
        throw new AppError("Invalid User", 401, ErrorType.NOT_FOUND_ERROR);
    }

    if (user.emailVerified || user.verifyEmailToken === null) {
        throw new AppError("Bad Request", 409, ErrorType.BAD_REQUEST_ERROR);
    }

    const hashedPassword = await userService.getPasswordHash(password);

    await userService.confirmUser({
        userId: id,
        password: hashedPassword,
    });
    return {
        id,
    };
};

const refreshUser = async (refreshToken: string) => {
    const decoded = jwt.verify(
        refreshToken as string,
        APP_CONSTANT.JWT_REFRESH_SECRET as string
    );
    if (!decoded) {
        throw new AppError("Invalid token", 401, ErrorType.INVALID_TOKEN_ERROR);
    }

    if (typeof decoded === "object" && "id" in decoded) {
        // const userFromDB = await userService.getById(Number(decoded.id));
        const userFromDB = await authenticateUser(Number(decoded.id), false);
        if (!userFromDB) {
            throw new AppError(
                "User not found",
                401,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        const accessToken = generateToken.accessToken({
            userId: userFromDB?.id,
            userType: "credentials",
            loginType: "credentials",
        });

        const refreshToken = generateToken.refreshToken({
            userId: userFromDB?.id,
            userType: "credentials",
            loginType: "credentials",
        });

        await userService.updateRefreshToken(userFromDB.id, refreshToken);

        return {
            id: userFromDB?.id,
            email: userFromDB?.email,
            type: "credentials",
            internalCompanies: userFromDB?.internalCompanies,
            role: {
                ...userFromDB?.role,
                permissions: userFromDB?.role?.permissions?.map((item) => {
                    return item;
                }),
            },

            accessToken,
            refreshToken,
            authenticated: true,
        };
    } else {
        throw new AppError("Invalid token", 401, ErrorType.INVALID_TOKEN_ERROR);
    }
};

const getUserInfo = async (userId: number) => {
    const user = await userService.getById(userId);

    if (!user) {
        return null;
    } else {
        const role = await roleService.getById(user.roleId);
        const internalCompanyList =
            await userService.getInternalCompanyByUserId({
                userId: user.id,
                populateInternalCompany: true,
            });

        console.log({
            internalCompanyList,
        });

        const internalCompaniesWithFeatures: TInternalCompany[] =
            await Promise.all(
                internalCompanyList.map(async (item) => {
                    const features: IFeatureInfo[] =
                        await userService.getUserFeatures(
                            user.id,
                            item.internal_company_id
                        );

                    return {
                        internal_company_id: item.internal_company_id,
                        name: item?.internal_company?.name,
                        slug: item?.internal_company?.slug,
                        logoUrl: item?.internal_company?.logoUrl,
                        isActive: item?.internal_company?.isActive,
                        features,
                    };
                })
            );

        return {
            id: user.id,
            email: user.email,
            role: {
                ...role,
                permissions: role.permissions?.map((item) => item.enumName),
            },
            type: "credentials",
            internalCompanies: internalCompaniesWithFeatures,
            authenticated: true,
        };
    }
};

const authenticateUser = async (userId: number, fromCache: boolean) => {
    let result = null;
    if (fromCache) {
        result = await RedisService.getValue<IUserInfo>(`user:${userId}`);
    }

    if (result) {
        return result;
    }

    if (!result) {
        const userFromDB = await getUserInfo(userId);
        if (!userFromDB) {
            return null;
        } else {
            const redisPayload = {
                id: userFromDB?.id,
                email: userFromDB?.email,
                type: "credentials",
                internalCompanies: userFromDB?.internalCompanies,
                role: {
                    ...userFromDB?.role,
                    permissions: userFromDB?.role?.permissions?.map((item) => {
                        return item;
                    }),
                },
                authenticated: true,
            };
            RedisService.setValue<IUserInfo>(
                `user:${userFromDB?.id}`,
                redisPayload
            );
            return redisPayload;
        }
    } else {
        return result;
    }
};

export default {
    loginWithCredentials,
    verifyEmailAndSetPassword,
    logout,
    refreshUser,
    authenticateUser,
};
