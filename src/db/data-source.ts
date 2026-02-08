import "reflect-metadata";

import APP_CONSTANT from "../constants/AppConfig";
import { DataSource } from "typeorm";
import entities from "./index";

const AppDataSource = new DataSource({
    type: "postgres",
    host: APP_CONSTANT.DB_HOST,
    port: APP_CONSTANT.DB_PORT,
    username: APP_CONSTANT.DB_USER,
    password: APP_CONSTANT.DB_PASSWORD,
    database: APP_CONSTANT.DB_NAME,
    // synchronize: true,
    synchronize: APP_CONSTANT.NODE_ENV === "development" ? true : false,
    //
    // Synchronize is true for development only
    logging: false,
    entities: entities,
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false,
    },
});

export const dataSource = new DataSource({
    type: "postgres",
    url: APP_CONSTANT.SUPERBASE_DB_URL,

    ssl: {
        rejectUnauthorized: false, // REQUIRED for Supabase
    },

    synchronize: true,
    logging: false,

    entities: entities,

    extra: {
        max: 5,
    },
});

export async function connectToDatabase() {
    try {
        const dbConnect = await dataSource.initialize();
        console.log("Connected to database :-", dbConnect.isInitialized);
    } catch (err: unknown) {
        console.error(err);
        // process.exit(1);
    }
}

export default dataSource;
