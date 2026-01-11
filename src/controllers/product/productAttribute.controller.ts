import { Request, Response } from "express";

import { ProductAttributeService } from "../../services/products/productAttribute.service";

const attributeService = new ProductAttributeService();

export class ProductAttributeController {
    async createAttribute(req: Request, res: Response) {
        const response = await attributeService.createAttribute(req.body);
        res.status(201).json({
            success: true,
            data: response,
            message: "Product attribute created successfully",
        });
    }

    async createAttributeValues(req: Request, res: Response) {
        const response = await attributeService.createAttributeValue(req.body);
        res.status(201).json({
            success: true,
            data: response,
            message: "Product attribute values created successfully",
        });
    }
}
