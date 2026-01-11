import { ProductController } from "../../controllers/product/products.controller";
import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";

const router = express.Router();

const productController = new ProductController();

// RoomType routes
// router.post("", roomController.create);
router.get("", applyPagination, asyncTryCatchFn(productController.getAll));
router.get(
    "/autocomplete",
    applyPagination,
    asyncTryCatchFn(productController.autocompleteSearch)
);

// router.get("/:id", asyncTryCatchFn(roomController.getById));
// router.put("/:id", asyncTryCatchFn(roomController.update));
// router.delete("/:id", asyncTryCatchFn(roomController.delete));

export default router;
