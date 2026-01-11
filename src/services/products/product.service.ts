import { ILike } from "typeorm";
import { Product } from "../../db/entity/ecommerce/Product";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";

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
}
