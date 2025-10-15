import axios, { AxiosError } from "axios";

import { AdminAudit } from "../../db/entity/AdminAudit";
import { ApiInfo } from "../../types/types";
import { addAdminAuditToQueue } from "../../jobs/AdminAudit.queue";

const getRequest = async (url: string, userId: number, apiInfo: ApiInfo) => {
    try {
        const res = await axios.get(url);
        console.log("LOG: ~ getRequest ~ res:", res);

        return {
            success: true,
            data: res.data,
            url: url,
        };
    } catch (error: unknown) {
        console.log("LOG: ~ getRequest ~ error:", error);
        const err = error as AxiosError;
        const payload = new AdminAudit();

        payload.userId = userId;
        payload.apiAction = apiInfo.apiAction ?? "UNKNOWN";
        payload.apiName = apiInfo.apiName ?? "UNKNOWN";
        payload.apiFor = apiInfo.apiFor ?? "UNKNOWN";
        payload.method = apiInfo.method ?? "GET";
        payload.requestBody = apiInfo.requestBody ?? undefined;
        payload.responseBody =
            typeof err.response?.data === "object" &&
            err.response?.data !== null &&
            !Array.isArray(err.response.data)
                ? (err.response.data as Record<string, unknown>)
                : undefined;
        payload.statusCode = err.response?.status ?? 500;
        payload.status = "ERROR";

        console.log("payload", payload);

        addAdminAuditToQueue(payload);
        return {
            success: false,
            data: null,
            url: url,
            error: err,
        };
    }
};

export = {
    getRequest,
};
