import dotenv from "dotenv";

dotenv.config();

const AWS_CONSTANT = {
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID as string,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY as string,
    S3_REGION: process.env.S3_REGION as string,
    PUBLIC_AWS_BUCKET_NAME: process.env.PUBLIC_AWS_BUCKET_NAME as string,
    PUBLIC_AWS_URL: process.env.PUBLIC_AWS_URL as string,
};

export default AWS_CONSTANT;
