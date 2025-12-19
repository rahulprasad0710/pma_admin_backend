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

@Entity({ name: "account" })
@Index("idx_account_user", ["user"])
@Index("idx_account_provider_account", ["provider_id", "account_id"], {
    unique: true,
})
export class Account {
    @PrimaryColumn({ type: "text" })
    id: string;

    @Column({ type: "text", name: "account_id" })
    account_id: string;

    @Column({ type: "text", name: "provider_id" })
    provider_id: string;

    @ManyToOne(() => UserCustomer, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: UserCustomer;

    @Column({ type: "text", nullable: true })
    access_token?: string;

    @Column({ type: "text", nullable: true })
    refresh_token?: string;

    @Column({ type: "text", nullable: true })
    id_token?: string;

    @Column({
        type: "timestamp",
        nullable: true,
        name: "access_token_expires_at",
    })
    access_token_expires_at?: Date;

    @Column({
        type: "timestamp",
        nullable: true,
        name: "refresh_token_expires_at",
    })
    refresh_token_expires_at?: Date;

    @Column({ type: "text", nullable: true })
    scope?: string;

    @Column({ type: "text", nullable: true })
    password?: string;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;
}
