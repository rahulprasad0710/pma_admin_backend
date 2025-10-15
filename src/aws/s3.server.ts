import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import AWS_CONSTANT from "../constants/AWSConfig";
import { UPLOAD_TYPE } from "../enums/aws.enum";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const randomKey = Math.random().toString(36).substring(2, 15);

interface IAwsUploadFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}

if (
    !AWS_CONSTANT.S3_ACCESS_KEY_ID ||
    !AWS_CONSTANT.S3_SECRET_ACCESS_KEY ||
    !AWS_CONSTANT.S3_REGION
) {
    throw new Error("Missing AWS configuration");
}

const client = new S3Client({
    region: AWS_CONSTANT.S3_REGION,
    credentials: {
        accessKeyId: AWS_CONSTANT.S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANT.S3_SECRET_ACCESS_KEY,
    },
});

async function putRequestToS3(
    uploadFile: IAwsUploadFile,
    key: string,
    upload_type: UPLOAD_TYPE
) {
    try {
        const bufferData = uploadFile.buffer;

        let params = {
            Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
            Key: key,
            Body: bufferData,
            ContentType: uploadFile.mimetype,
        };

        if (upload_type === UPLOAD_TYPE.PUBLIC) {
            params = {
                Bucket: AWS_CONSTANT.PUBLIC_AWS_BUCKET_NAME,
                Key: key,
                Body: bufferData,
                ContentType: uploadFile.mimetype,
            };
        }

        console.log({
            upload_type,
            params,
        });

        const command = new PutObjectCommand(params);

        const results = await client.send(command);
        return results;
    } catch (error) {
        console.log("LOG: ~ putRequestToS3 ~ error:", error);
        // TODO Add Logging

        return null;
    }
}

async function getPreSignedUrl({
    bucketKey,
    upload_type,
}: {
    bucketKey: string;
    upload_type?: UPLOAD_TYPE;
}) {
    try {
        const command = new GetObjectCommand({
            Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
            Key: bucketKey,
        });

        let url = "";
        if (upload_type === "PUBLIC") {
            url = await getSignedUrl(client, command);
        } else {
            url = await getSignedUrl(client, command, {
                expiresIn: 3600,
            });
        }

        return {
            url,
            success: true,
            message: "OK",
        };
    } catch (error) {
        // throw new Error(error instanceof Error ? error.message : String(error));

        // TODO  : add logging here.
        return {
            success: false,
            message: "Error getting signed URL",
            url: "",
        };
    }
}

export default {
    getPreSignedUrl,
    putRequestToS3,
};
