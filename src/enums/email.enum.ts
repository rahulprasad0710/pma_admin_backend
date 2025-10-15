export enum EmailType {
    USER_EMAIL_VERIFICATION = "user_email_verification",
    BOOKING_CONFIRMATION = "booking_confirmation",
}

export enum EmailStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    QUEUED = "queued",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
}

export enum EmailSendType {
    DIRECT = "DIRECT",
    QUEUED = "QUEUED",
}
