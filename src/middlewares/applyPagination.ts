import { NextFunction, Request, Response } from "express";

import { FindManyOptions } from "typeorm";

const applyPaginationMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const { page, pageSize, keyword, isPaginationEnabled } = req.query;
    const pagination = applyPagination(
        isPaginationEnabled === undefined
            ? true
            : isPaginationEnabled === "true",
        keyword as string,
        page ? Number(page) : undefined,
        pageSize ? Number(pageSize) : undefined
    );
    req.pagination = pagination;
    next();
};

const applyPagination = <T extends FindManyOptions<T>>(
    isPaginationEnabled: boolean,
    keyword?: string,
    page?: number,
    pageSize?: number
): {
    skip?: number;
    take?: number;
    keyword?: string;
    isPaginationEnabled: boolean;
} => {
    if (keyword) {
        keyword = keyword.trim();
    }

    if (isPaginationEnabled && page !== undefined && pageSize !== undefined) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        return {
            keyword,
            skip,
            take,
            isPaginationEnabled: true,
        };
    } else if (
        isPaginationEnabled &&
        page === undefined &&
        pageSize === undefined
    ) {
        const skip = 0;
        const take = 10;

        return {
            keyword,
            skip,
            take,
            isPaginationEnabled: true,
        };
    } else {
        return {
            keyword,
            skip: undefined,
            take: undefined,
            isPaginationEnabled: false,
        };
    }
};

export default applyPaginationMiddleware;
