import dotenv from "dotenv";

dotenv.config();

// const env = process.env.NODE_ENV || "development";
// if (env === "development") {
//     dotenv.config({ path: ".env.local" });
// } else if (env === "production") {
//     dotenv.config({ path: ".env.production" });
// } else if (env === "test") {
//     dotenv.config({ path: ".env.test" });
// }

const APP_CONSTANT = {
    PORT: process.env.PORT || 3000,
    REDIS_URL: process.env.REDIS_URL,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT) as number,
    DB_NAME: process.env.DB_NAME,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    NODE_ENV: "development",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    COMPANY_NAME: process.env.COMPANY_NAME,
    COMPANY_EMAIL_USER: process.env.COMPANY_EMAIL_USER,
    COMPANY_EMAIL_PASS: process.env.COMPANY_EMAIL_PASS,
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    START_APP_EMAIL: process.env.START_APP_EMAIL,
    NEXT_CLIENT_URL: process.env.NEXT_CLIENT_URL,
    REVALIDATE_TOKEN: process.env.REVALIDATE_TOKEN,
    SUPERBASE_DB_URL: process.env.SUPERBASE_DB_URL,
};

export default APP_CONSTANT;
