import { Client } from "@elastic/elasticsearch";
import { ElasticsearchService } from "../../config/elasticSearch";
import { Product } from "../../db/entity/ecommerce/Product";

const esService = ElasticsearchService.getInstance();
interface IESProductSource {
    productId: number;
    title: string;
    short_description: string;
    brand: string;
    search_keywords: string[];
}

export class SearchService {
    private esClient: Client;
    private productIndexName = "products";

    constructor() {
        this.esClient = esService.getClient();
    }

    /** Insert a single product into Elasticsearch */
    async insertProduct(product: Product) {
        try {
            const response = await this.esClient.index({
                index: this.productIndexName,
                id: String(product.id),
                document: {
                    productId: product.id,
                    title: product.title,
                    brand: product.brand,
                    short_description: product.short_description,
                    search_keywords:
                        product.search_keywords || product.short_description,
                },
                refresh: "wait_for",
            });

            console.log(`✅ Inserted product ${product.id} into Elasticsearch`);
            return response;
        } catch (error) {
            console.error("❌ insertProduct error:", error);
            throw error;
        }
    }

    /** Search products with better query */
    async searchProducts(query: string, size = 20) {
        try {
            const result = await this.esClient.search<IESProductSource>({
                index: this.productIndexName,
                size,
                query: {
                    bool: {
                        should: [
                            {
                                multi_match: {
                                    query: query,
                                    fields: [
                                        "title^3",
                                        "brand^2",
                                        "search_keywords^5",
                                        "short_description",
                                    ],
                                    fuzziness: "AUTO",
                                    operator: "or",
                                },
                            },
                            {
                                match: {
                                    "title.autocomplete": {
                                        query: query,
                                        boost: 2,
                                    },
                                },
                            },
                        ],
                    },
                },
                highlight: {
                    fields: {
                        title: {},
                        brand: {},
                        short_description: {},
                    },
                },
            });

            console.log(
                `🔍 Found ${result.hits.hits.length} results for query: "${query}"`
            );

            return {
                total: result.hits.total,
                hits: result.hits.hits.map((hit) => ({
                    ...hit._source,
                    highlight: hit.highlight,
                })),
            };
        } catch (error) {
            console.error("❌ searchProducts error:", error);
            throw error;
        }
    }

    /** Autocomplete suggestions */
    async autocomplete(clientQuery: string, size = 12) {
        try {
            const result = await this.esClient.search<IESProductSource>({
                index: "products",
                size: size,
                _source: [
                    "productId",
                    "title",
                    "brand",
                    "short_description",
                    "search_keywords",
                ],
                query: {
                    bool: {
                        should: [
                            // Fuzzy search on title
                            {
                                match: {
                                    title: {
                                        query: clientQuery,
                                        fuzziness: "AUTO",
                                        boost: 3,
                                    },
                                },
                            },
                            // Fuzzy search on search_keywords
                            {
                                match: {
                                    search_keywords: {
                                        query: clientQuery,
                                        fuzziness: "AUTO",
                                        boost: 5,
                                    },
                                },
                            },
                            // Prefix search on brand (optional)
                            {
                                match_phrase_prefix: {
                                    brand: {
                                        query: clientQuery,
                                        boost: 2,
                                    },
                                },
                            },
                        ],
                    },
                },
            });

            const suggestions = result.hits.hits.map((hit) => ({
                id: hit._source!.productId,
                title: hit._source!.title,
                brand: hit._source!.brand,
                search_keywords: hit._source!.search_keywords,
            }));

            return suggestions;
        } catch (error) {
            console.error("❌ autocomplete error:", error);
            return [];
        }
    }

    /** Debug: Get all indices info */
    async getIndicesInfo() {
        try {
            const indices = await this.esClient.cat.indices({ format: "json" });
            console.log("📊 Indices:", indices);
            return indices;
        } catch (error) {
            console.error("❌ getIndicesInfo error:", error);
            return [];
        }
    }
}
