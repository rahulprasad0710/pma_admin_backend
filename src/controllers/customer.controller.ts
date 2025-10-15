import { Request, Response } from "express";

import { CustomerService } from "../services/customer.service";
import { IPagination } from "../types/express";

const customerService = new CustomerService();

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const { isActive } = req.query;

    let isAccountByAdmin = undefined;

    if (isActive === "true") {
        isAccountByAdmin = true;
    } else if (isActive === "false") {
        isAccountByAdmin = false;
    } else {
        isAccountByAdmin = undefined;
    }

    const data = await customerService.getAll({
        isPaginationEnabled,
        keyword,
        skip,
        take,
        isActive: isAccountByAdmin,
    });

    res.status(200).json({
        success: true,
        data: data,
        message: "Customer fetched successfully",
    });
};

export default {
    getAll,
};
