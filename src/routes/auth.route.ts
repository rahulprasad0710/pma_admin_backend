import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authController from "../controllers/auth.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.get("/me", verifyToken, asyncTryCatchFn(authController.authenticateMe));
router.get("/logout", verifyToken, asyncTryCatchFn(authController.logout));
router.post("/login", asyncTryCatchFn(authController.login));
router.post(
    "/refresh-token",
    verifyToken,
    asyncTryCatchFn(authController.refreshUser)
);
router.post(
    "/verify-email",
    asyncTryCatchFn(authController.verifyEmailAndSetPassword)
);

export default router;
