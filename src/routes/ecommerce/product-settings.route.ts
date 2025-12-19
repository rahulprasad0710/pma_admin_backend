import {
    CreateAttributeValueSchema,
    CreateProductAttributeSchema,
} from "../../validator/ecommerce/product.validation";

import { ProductAttributeController } from "../../controllers/ecommerce/product/productAttribute.controller";
import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";
import requestValidator from "../../middlewares/requestValidator";

const router = express.Router();

const productAttributeController = new ProductAttributeController();

router.post(
    "/attributes",
    requestValidator(CreateProductAttributeSchema),
    asyncTryCatchFn(productAttributeController.createAttribute)
);

router.post(
    "/attribute-values",
    requestValidator(CreateAttributeValueSchema),
    asyncTryCatchFn(productAttributeController.createAttributeValues)
);

export default router;
