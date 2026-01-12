import APP_CONSTANT from "../constants/AppConfig";
import { Client } from "@elastic/elasticsearch";

export class ElasticsearchService {
    private static instance: ElasticsearchService;
    private client: Client;

    private constructor() {
        // Initialize Elasticsearch client
        this.client = new Client({
            node: APP_CONSTANT.ELASTICSEARCH_URL,
            auth: {
                username: APP_CONSTANT.ES_USERNAME || "elastic",
                password: APP_CONSTANT.ES_PASSWORD || "rahul",
            },
            maxRetries: 5,
            requestTimeout: 60000,
        });

        console.log("✅ Elasticsearch client initialized");

        // Check cluster health
        this.testConnection();
    }

    /** Test Elasticsearch connection */
    async testConnection() {
        try {
            const ping = await this.client.ping();
            const health = await this.client.cluster.health({});
            console.log("✅ Elasticsearch connected:", ping, health);
        } catch (error) {
            console.error("❌ Cannot connect to Elasticsearch:", error);
        }
    }

    /** Singleton getter */
    public static getInstance(): ElasticsearchService {
        if (!ElasticsearchService.instance) {
            ElasticsearchService.instance = new ElasticsearchService();
        }
        return ElasticsearchService.instance;
    }

    /** Get the underlying ES client */
    public getClient(): Client {
        return this.client;
    }
}
