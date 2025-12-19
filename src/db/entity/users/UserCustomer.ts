import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

import { Account } from "./Account";
import { Session } from "./Session";

@Entity({ name: "user_customer" })
@Index("idx_user_customer_email", ["email"], { unique: true })
export class UserCustomer {
    @PrimaryColumn({ type: "text" })
    id: string;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text" })
    email: string;

    @Column({ type: "boolean", default: false })
    email_verified: boolean;

    @Column({ type: "text", nullable: true })
    image?: string;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;

    /* Relations */

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];
}
