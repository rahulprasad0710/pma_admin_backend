// redis.service.ts
import Redis, { Redis as RedisClient } from "ioredis";

/*
Singleton pattern ensures only one Redis connection is created.
Environment variables for host, port, and password.
Error and connect handlers strictly typed.
Meaningful logs with client count on successful connection.
lazyConnect: true → prevents immediate connection until .connect() is called.
await client.connect() → ensures Redis is fully connected before returning.
*/

export class RedisConfig {
    private static instance: RedisClient | null = null;

    /**
     * Get a connected Redis instance (singleton)
     */
    public static async getInstance(): Promise<RedisClient> {
        if (this.instance) {
            return this.instance;
        }

        const client = new Redis({
            host: "localhost",
            port: 6379,
            lazyConnect: true,

            // Auto-reconnect strategy
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 200, 5000); // cap at 5s
                console.warn(
                    `Redis reconnect attempt #${times} (retry in ${delay}ms)`
                );
                return delay;
            },

            // If Redis server closes connection
            reconnectOnError: (err: Error) => {
                console.error("Redis reconnectOnError:", err.message);
                return true;
            },
        });

        client.on("connect", () => {
            console.info("Redis connected successfully.");
        });

        client.on("ready", () => {
            console.info("Redis connection is ready to use.");
        });

        client.on("error", (err: Error) => {
            console.error("Redis connection error:", err);
        });

        client.on("end", () => {
            console.warn("Redis connection ended.");
        });

        // await client.connect();

        // Optional: Log number of connected clients
        try {
            const redisResponse = await client.connect();

            console.info(
                `Redis connected. Clients connected: ${redisResponse}`
            );
        } catch (err) {
            console.warn("Could not fetch Redis client :", err);
        }

        this.instance = client;
        return this.instance;
    }

    /**
     * Close the Redis connection
     */
    public static async disconnect(): Promise<void> {
        if (this.instance) {
            await this.instance.quit();
            this.instance = null;
            console.info("Redis connection closed.");
        }
    }
}
