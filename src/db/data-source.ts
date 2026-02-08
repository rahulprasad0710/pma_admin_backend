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
    url: "postgresql://postgres:rahul99dbsuperbase@db.huzukjbojrvxsdrrlbzn.supabase.co:5432/postgres",

    ssl: {
        rejectUnauthorized: false, // REQUIRED for Supabase
    },

    synchronize: true,
    logging: false,

    entities: entities,
    migrations: ["dist/migrations/*.js"],

    extra: {
        max: 5, // IMPORTANT: Supabase pgbouncer
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
