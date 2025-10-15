import { Router as ExpressRouter } from "express";
import { RequestHandler } from "express";
import multerUpload from "../middlewares/multerUpload";
import uploadController from "../controllers/upload.controller";

const router = ExpressRouter();

router
    .post(
        "/",
        multerUpload.single("file") as RequestHandler,
        uploadController.create
    )
    .get("/url", uploadController.getPresignedUrl)
    .get("/url/:uploadId", uploadController.getSignedUrlByUploadId);

export default router;
