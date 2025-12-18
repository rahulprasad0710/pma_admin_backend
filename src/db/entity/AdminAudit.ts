import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("audit_logs")
@Index("idx_audit_logs_api_for", ["apiFor"])
@Index("idx_audit_logs_api_action", ["apiAction"])
@Index("idx_audit_logs_status", ["status"])
@Index("idx_audit_logs_created_at", ["createdAt"])
export class AdminAudit {
    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id: number;

    @Column()
    userId: number;

    @Column({ type: "varchar", length: 255 })
    apiName: string;

    @Column({ type: "varchar", length: 255 })
    apiFor: string;

    @Column({ type: "varchar", length: 255 })
    apiAction: string;

    @Column({ type: "varchar", length: 10 })
    method: string;

    @Column({ type: "jsonb", nullable: true })
    requestBody?: Record<string, unknown>;

    @Column({ type: "jsonb", nullable: true })
    responseBody?: Record<string, unknown>;

    @Column({ type: "int" })
    statusCode: number;

    @Column({
        type: "varchar",
        length: 20,
    })
    status: "SUCCESS" | "ERROR" | "WARNING" | "FATAL";

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
