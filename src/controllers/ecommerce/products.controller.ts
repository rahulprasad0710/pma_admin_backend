import { Request, Response } from "express";

import { IPagination } from "../../types/express";
import { ProductService } from "../../services/ecommerce/product.service";

const productService = new ProductService();

export class ProductController {
    async getAll(req: Request, res: Response) {
        const { isActive } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;

        const response = await productService.getAll({
            isActive: isActive === "true",
            isPaginationEnabled,
            keyword,
            skip,
            take,
        });
        res.status(200).json({
            success: true,
            data: response,
            message: "Product fetched successfully",
        });
    }
    async getProductDetailsForCustomer(req: Request, res: Response) {
        const { isActive } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;

        const result = await productService.getAll({
            isActive: isActive === "true",
            isPaginationEnabled,
            keyword,
            skip,
            take,
        });
        res.status(200).json({
            success: true,
            data: result,
            message: "Product fetched successfully",
        });
    }
}
