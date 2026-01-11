import { Client } from "@elastic/elasticsearch";

let client: Client | null = null;

export const getESClient = (): Client => {
    if (!client) {
        client = new Client({
            node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
            auth: {
                username: process.env.ES_USER || "elastic",
                password: process.env.ES_PASSWORD || "changeme",
            },
            maxRetries: 5,
            requestTimeout: 60000,
            sniffOnStart: true,
        });

        // Ping ES to check if the cluster is up
        client
            .ping()
            .then(() => {
                console.log("✅ Elasticsearch cluster is up and running.");
            })
            .catch((err) => {
                console.error("❌ Elasticsearch cluster is down!", err);
            });
    }

    return client;
};
