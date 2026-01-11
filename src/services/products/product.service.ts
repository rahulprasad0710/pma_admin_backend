import { ILike } from "typeorm";
import { Product } from "../../db/entity/ecommerce/Product";
import { SearchService } from "../config/elasticSearch.service";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";

const searchService = new SearchService();
interface IMainProduct {
    details?: string;
    comment?: string;
}

type TGetAllProductsParams = {
    isActive?: boolean;
    isPaginationEnabled: boolean;
    keyword?: string;
    skip?: number;
    take?: number;
};

export class ProductService {
    private readonly productRepository = dataSource.getRepository(Product);

    async getAll({
        isActive,
        isPaginationEnabled,
        keyword,
        skip,
        take,
    }: TGetAllProductsParams) {
        const [result, totalCount] = await this.productRepository.findAndCount({
            where: {
                ...(keyword ? { title: ILike(`%${keyword}%`) } : {}),
            },
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
        });
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async autocompleteSearch(clientQuery: string) {
        try {
            const response = await searchService.autocomplete(clientQuery, 10);
            return response;
        } catch (error) {
            console.log(
                "LOG: ~ ProductService ~ autocompleteSearch ~ error:",
                error
            );
        }
    }
}
