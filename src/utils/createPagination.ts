const createPagination = (
    skip: number | undefined,
    pageSize: number | undefined,
    totalCount: number,
    isPaginationEnabled: boolean
) => {
    const newPageSize = isPaginationEnabled ? pageSize ?? 10 : totalCount;

    if (skip === undefined || newPageSize === undefined) {
        return {
            currentPage: 1,
            pageSize: totalCount,
            totalCount,
            totalPages: 1,
        };
    } else {
        const totalPages = isPaginationEnabled
            ? Math.ceil(totalCount / newPageSize)
            : 1;
        return {
            currentPage: isPaginationEnabled
                ? Math.ceil(skip / newPageSize) + 1
                : 1,
            pageSize: isPaginationEnabled ? pageSize : totalCount,
            totalCount,
            totalPages,
        };
    }
};

export default createPagination;
