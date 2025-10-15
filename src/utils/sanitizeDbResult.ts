type TPayload<T, K extends keyof T> = {
    selectFields: K[];
    result: T[];
};

export const sanitizeDBResult = <T, K extends keyof T>({
    selectFields,
    result,
}: TPayload<T, K>): Pick<T, K>[] => {
    return result.map((item) => {
        const newItem = {} as Pick<T, K>;
        selectFields.forEach((field) => {
            newItem[field] = item[field];
        });
        return newItem;
    });
};
