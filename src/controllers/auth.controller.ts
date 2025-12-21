import { Request, Response } from "express";

import authService from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, isRememberMe } = req.body;

    console.log({
        email,
        password,
        isRememberMe,
    });

    const { refreshToken, ...rest } = await authService.loginWithCredentials(
        email,
        password
    );

    const refreshTokenProvided = isRememberMe ? refreshToken : null;

    res.cookie("refreshToken", refreshTokenProvided, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    const incomingRefreshToken = req?.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        res.status(401).json({
            success: false,
            data: null,
            message: "No refresh token provided",
        });
        return;
    }

    const { refreshToken, ...rest } = await authService.refreshUser(
        incomingRefreshToken
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .status(200)
        .json({
            success: true,
            data: rest,
            message: "refresh token successful",
        });
};

const authenticateMe = async (req: Request, res: Response) => {
    const { verifiedUserId } = req;
    const response = await authService.authenticateUser(verifiedUserId, true);

    res.status(200).json({
        success: true,
        data: response,
        message: "User authenticated successfully",
    });
};

export default {
    login,
    verifyEmailAndSetPassword,
    logout,
    authenticateMe,
    refreshUser,
};
