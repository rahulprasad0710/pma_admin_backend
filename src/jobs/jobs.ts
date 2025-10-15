import { AdminAudit } from "../db/entity/AdminAudit";
import { TEmail } from "../types/types";
import { getAdminAuditQueue } from "./AdminAudit.queue";
import { getEmailQueue } from "./emailQueue";
import { insertAuditLog } from "../services/loggin.service";
import { sendEmail } from "../config/email.config";

export const redisConfig = {
    redis: {
        port: 6379, // Redis server port
        host: "localhost", // Redis server host
    },
};

async function startQueue() {
    await startEmailQueue();
    await startAdminAuditQueue();
}

async function startEmailQueue() {
    // Process jobs from the queue
    const emailQueue = await getEmailQueue(); // ensure queue is ready
    emailQueue.process("email-queue", async (job) => {
        const emailTemplate: TEmail = job.data;

        try {
            const response = await sendEmail(emailTemplate);
            console.log("LOG: ~ startEmailQueue ~ response:", response);
            return response;
        } catch (err: unknown) {
            // TODO  ADD LOGGING
            console.error(`Retrying job ${job.id} due to error:`, err);
            throw err; // ! important: rethrow so Bull knows it failed DO NOT delete this line.
        }
    });

    // Event listener for completed jobs
    emailQueue.on("failed", (job, err) => {
        console.error(
            `Job ID ${job.id} failed on attempt ${job.attemptsMade} of ${job.opts.attempts}. Error:`,
            err
        );
        // TODO: Implement error handling logic (e.g., alerting, retries)
        // For example, you could send an alert to the admin or retry the job
    });
    // Event listener for failed jobs

    emailQueue.on("completed", (job, result) => {
        console.log(
            `✅ Job ID ${job.id} succeeded after ${job.attemptsMade} attempt(s).`
        );
    });
}

async function startAdminAuditQueue() {
    // Process jobs from the queue
    const emailQueue = await getAdminAuditQueue();
    emailQueue.process("admin-audit-queue", async (job) => {
        const payload: AdminAudit = job.data;

        try {
            const response = await insertAuditLog(payload);
            return response;
        } catch (err: unknown) {
            // TODO  ADD LOGGING
            console.error(`Retrying job ${job.id} due to error:`, err);
            throw err; // ! important: rethrow so Bull knows it failed DO NOT delete this line.
        }
    });

    // Event listener for completed jobs
    emailQueue.on("failed", (job, err) => {
        console.error(
            `Job ID ${job.id} failed on attempt ${job.attemptsMade} of ${job.opts.attempts}. Error:`,
            err
        );
        // TODO: Implement error handling logic (e.g., alerting, retries)
        // For example, you could send an alert to the admin or retry the job
    });
    // Event listener for failed jobs

    emailQueue.on("completed", (job, result) => {
        console.log(
            `✅ Job ID ${job.id} succeeded after ${job.attemptsMade} attempt(s).`
        );
    });
}
export default startQueue;
