import { ParsedQs } from "qs";

const normalizeToString = (
    value: string | ParsedQs | (string | ParsedQs)[] | undefined
): string => {
    if (Array.isArray(value)) return String(value[0]);
    if (typeof value === "string") return value;
    return "";
};

export default normalizeToString;
