import Queue, { Queue as QueueType } from "bull";

import { AdminAudit } from "../db/entity/AdminAudit";
import { redisConfig } from "./jobs";

let adminAuditQueue: QueueType<AdminAudit> | null = null;

export async function getAdminAuditQueue(): Promise<QueueType<AdminAudit>> {
    if (adminAuditQueue) return adminAuditQueue;

    adminAuditQueue = new Queue<AdminAudit>("admin-audit-queue", redisConfig);

    return adminAuditQueue;
}

export async function addAdminAuditToQueue(payload: AdminAudit) {
    const emailQueue = await getAdminAuditQueue();
    await emailQueue.add("admin-audit-queue", payload, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
}
