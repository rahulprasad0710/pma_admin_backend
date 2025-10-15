import { Request, Response } from "express";

import { UPLOAD_TYPE } from "../enums/aws.enum";
import UploadService from "../services/upload.service";

interface UploadRequest extends Request {
    query: {
        uploadType?: UPLOAD_TYPE;
    };
}

const uploadService = new UploadService();

const getPresignedUrl = async (req: Request, res: Response): Promise<void> => {
    const { fileName } = req.query;
    const fileNameStr = fileName as string;

    const url = await uploadService.getPresignedUrl({
        bucketKey: fileNameStr,
    });
    res.status(200).json({
        success: true,
        data: url,
        message: "Presigned URL generated",
    });
};

const create = async (req: UploadRequest, res: Response): Promise<void> => {
    const { verifiedUserId } = req;
    const { file } = req;
    const { uploadType } = req.query;

    let upload_type: UPLOAD_TYPE = UPLOAD_TYPE.PRIVATE;

    if (!file) {
        res.status(400).json({
            success: false,
            message: "Invalid or missing file. ",
        });
        return;
    }

    if (!uploadType || !Object.values(UPLOAD_TYPE).includes(uploadType)) {
        upload_type = UPLOAD_TYPE.PRIVATE;
    } else {
        upload_type = uploadType;
    }

    const result = await uploadService.create(
        file,
        verifiedUserId,
        upload_type
    );
    res.status(201).json({
        success: true,
        data: result,
        message: "File uploaded",
    });
};

const getSignedUrlByUploadId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { uploadId } = req.params;

    const result = await uploadService.getSignedUrlByUploadId(String(uploadId));
    res.status(201).json({
        success: true,
        data: result,
        message: "File fetched successfully.",
    });
};

export default {
    create,
    getPresignedUrl,
    getSignedUrlByUploadId,
};
