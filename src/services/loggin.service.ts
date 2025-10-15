import { AdminAudit } from "../db/entity/AdminAudit";
import dataSource from "../db/data-source";

const auditRepository = dataSource.getRepository(AdminAudit);

/**
 * Inserts a new audit log entry into the database
 */
export const insertAuditLog = async ({
    userId,
    apiName,
    apiFor,
    apiAction,
    method,
    requestBody = undefined,
    responseBody = undefined,
    statusCode,
    status,
}: {
    userId: number;
    apiName: string;
    apiFor: string;
    apiAction: string;
    method: string;
    requestBody?: Record<string, unknown>;
    responseBody?: Record<string, unknown>;
    statusCode: number;
    status: "SUCCESS" | "ERROR" | "WARNING" | "FATAL";
}) => {
    try {
        const auditPayload = new AdminAudit();

        auditPayload.userId = userId;
        auditPayload.apiAction = apiAction;
        auditPayload.apiName = apiName;
        auditPayload.apiFor = apiFor;
        auditPayload.method = method;
        auditPayload.requestBody = requestBody;
        auditPayload.responseBody = responseBody;
        auditPayload.statusCode = statusCode;
        auditPayload.status = status;

        const result = await auditRepository.save(auditPayload);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.log("LOG: ~ insertAuditLog ~ error:", error);
        return {
            success: false,
            error,
        };
    }
};
