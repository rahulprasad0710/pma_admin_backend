import { Request, Response } from "express";

import authService from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, isRememberMe } = req.body;

    const { refreshToken, ...rest } = await authService.loginWithCredentials(
        email,
        password,
        isRememberMe
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: isRememberMe
            ? 30 * 24 * 60 * 60 * 1000 // 30 days
            : 60 * 60 * 1000, //1 hr
    })
        .status(200)
        .json({
            success: true,
            data: rest,
            message: "login successful",
        });
};

const logout = async (req: Request, res: Response) => {
    const { verifiedUserId } = req;
    const response = await authService.logout(verifiedUserId);

    res.cookie("refreshToken", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
        .status(200)
        .json({
            success: true,
            data: response,
            message: "login successful",
        });
};

const verifyEmailAndSetPassword = async (req: Request, res: Response) => {
    const response = await authService.verifyEmailAndSetPassword({
        id: req.body.id,
        password: req.body.password,
        token: req.body.token,
    });

    res.status(200).json({
        success: true,
        data: response,
        message: "Password set successfully",
    });
};

const refreshUser = async (req: Request, res: Response) => {
    const { verifiedUserId, verifiedUser } = req;

    const isRememberMe = verifiedUser?.is_remember_me;

    const { refreshToken, accessToken } = await authService.refreshUser(
        verifiedUserId,
        isRememberMe
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: isRememberMe
            ? 30 * 24 * 60 * 60 * 1000 // 30 days
            : 60 * 60 * 1000, //1 hr
    })
        .status(200)
        .json({
            success: true,
            data: {
                ...verifiedUser,
                accessToken,
            },
            message: "refresh token successful.",
        });
};

const authenticateUser = async (req: Request, res: Response) => {
    const { verifiedUserId, verifiedUser } = req;
    const accessToken = await authService.authenticateMe(verifiedUserId);

    res.status(200).json({
        success: true,
        data: {
            ...verifiedUser,
            accessToken,
        },
        message: "User authenticated successfully",
    });
};

export default {
    login,
    verifyEmailAndSetPassword,
    logout,
    authenticateUser,
    refreshUser,
};
