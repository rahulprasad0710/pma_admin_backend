import verifyToken, { verifyRefreshToken } from "../middlewares/authentication";

import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authController from "../controllers/auth.controller";

const router = ExpressRouter();

router.get(
    "/me",
    verifyRefreshToken,
    asyncTryCatchFn(authController.authenticateUser)
);
router.get("/logout", verifyToken, asyncTryCatchFn(authController.logout));
router.post("/login", asyncTryCatchFn(authController.login));
router.post(
    "/refresh-token",
    verifyRefreshToken,
    asyncTryCatchFn(authController.refreshUser)
);
router.post(
    "/verify-email",
    asyncTryCatchFn(authController.verifyEmailAndSetPassword)
);

export default router;
