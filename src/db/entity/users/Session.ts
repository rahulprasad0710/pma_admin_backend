import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

import { UserCustomer } from "./UserCustomer";

@Entity({ name: "session" })
@Index("idx_session_token", ["token"], { unique: true })
@Index("idx_session_user", ["user"])
export class Session {
    @PrimaryColumn({ type: "text" })
    id: string;

    @Column({ type: "timestamp", name: "expires_at" })
    expires_at: Date;

    @Column({ type: "text" })
    token: string;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;

    @Column({ type: "text", nullable: true, name: "ip_address" })
    ip_address?: string;

    @Column({ type: "text", nullable: true, name: "user_agent" })
    user_agent?: string;

    @ManyToOne(() => UserCustomer, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: UserCustomer;
}
