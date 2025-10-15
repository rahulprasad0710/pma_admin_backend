import AWS_CONSTANT from "../constants/AWSConfig";
import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { UPLOAD_TYPE } from "../enums/aws.enum";
import { UploadFile } from "../db/entity/uploads";
import { User } from "../db/entity/User";
import awsService from "../aws/s3.server";
import dataSource from "../db/data-source";
import { generateUniqueId } from "../utils/generateUniqueId";

interface IAwsUploadFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}

export interface IUploadSignedUrlResponse {
    url: string;
    message: string;
    id: string;
    success: boolean;
}

export interface IUploadFile {
    filename: string;
    originalname: string;
    size: number;
    extension: string;
    mimetype?: string;
    fileType?: string;
    cloudPath?: string;
    cloudId?: string;
    cloudUrl?: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUploadFileURL extends IUploadFile {
    id: string;
    backendUrl: string;
}

export class UploadService {
    private readonly uploadRepository = dataSource.getRepository(UploadFile);
    private readonly userRepository = dataSource.getRepository(User);

    async create(
        uploadFile: IAwsUploadFile,
        userId: number,
        upload_type: UPLOAD_TYPE
        // folder?: string
    ) {
        const id = await generateUniqueId();
        const s3Key = `${id}_${uploadFile.originalname}`;

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(
                "User Not Found.",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        const uploadResponse = await awsService.putRequestToS3(
            uploadFile,
            s3Key,
            upload_type
        );

        if (!uploadResponse || !uploadResponse?.ETag) {
            return new AppError(
                "File Upload Error",
                500,
                ErrorType.INTERNAL_SERVER_ERROR
            );
        }

        const { ETag } = uploadResponse;

        const uploadPayload = new UploadFile();

        const awsUrl = `${AWS_CONSTANT.PUBLIC_AWS_URL}/${s3Key}`;

        uploadPayload.filename = `${id}_${uploadFile.originalname}`;
        uploadPayload.originalname = uploadFile.originalname;
        uploadPayload.size = uploadFile.size;
        uploadPayload.extension = uploadFile.mimetype;
        uploadPayload.mimetype = uploadFile.mimetype;
        uploadPayload.fileType = uploadFile.mimetype;
        uploadPayload.cloudPath = `${id}_${uploadFile.originalname}`;
        uploadPayload.cloudId = ETag;
        uploadPayload.cloudUrl = awsUrl ?? uploadFile.originalname;
        uploadPayload.createdBy = user;
        uploadPayload.createdAt = new Date();
        uploadPayload.updatedAt = new Date();
        uploadPayload.upload_type = upload_type;

        const result = await this.uploadRepository.save(uploadPayload);
        return {
            ...result,
            createdBy: result.createdBy,
        };
    }

    async getPresignedUrl({
        bucketKey,
        upload_type,
    }: {
        bucketKey: string;
        upload_type?: UPLOAD_TYPE;
    }) {
        const url = await awsService.getPreSignedUrl({
            bucketKey,
            upload_type,
        });
        console.log("LOG: ~ UploadService ~ getPresignedUrl ~ url:", url);
        return url;
    }

    async getUrlList(EtagList: UploadFile[]) {
        let response: IUploadFileURL[] = [];

        response = await Promise.all(
            EtagList.map(async (file: UploadFile) => {
                const result = await this.getPresignedUrl({
                    bucketKey: file.filename,
                });
                return {
                    ...file,
                    backendUrl: result?.url,
                };
            })
        );
        return response;
    }

    async getSignedUrlByUploadId(uploadId: string, upload_type?: UPLOAD_TYPE) {
        const uploadResult = await this.uploadRepository.findOne({
            where: {
                id: uploadId,
            },
        });
        if (!uploadResult) {
            return {
                url: "",
                id: uploadId,
                success: false,
                message: "File Id not found",
            };
        } else {
            const getUrl = await this.getPresignedUrl({
                bucketKey: uploadResult?.filename,
                upload_type,
            });
            return {
                ...getUrl,
                id: uploadId,
            };
        }
    }
}

export default UploadService;
