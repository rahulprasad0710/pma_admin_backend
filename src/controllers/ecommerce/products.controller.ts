import { Request, Response } from "express";

import { IPagination } from "../../types/express";
import { ProductService } from "../../services/ecommerce/product.service";

const productService = new ProductService();

export class ProductController {
    // async create(req: Request, res: Response) {
    //     const { roomNumber, internalCompanyId, roomTypeId, isActive } =
    //         req.body;

    //     const result = await productService.create({
    //         roomNumber,
    //         internal_company: internalCompanyId,
    //         roomType: roomTypeId,
    //         isActive: isActive,
    //     });
    //     res.status(201).json({
    //         success: true,
    //         data: result,
    //         message: "Room created successfully",
    //     });
    // }

    async getAll(req: Request, res: Response) {
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
