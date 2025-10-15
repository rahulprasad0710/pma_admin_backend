import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";

import { InternalCompany } from "../InternalCompany";

// ---------------------- CUSTOMER ----------------------
@Entity("user_customer")
@Unique(["email"])
export class Customer {
    @PrimaryColumn("text")
    id: string;

    @Column("text")
    name: string;

    @Column("text")
    email: string;

    @Column({ type: "boolean", default: false })
    emailVerified: boolean;

    @Column({ type: "text", nullable: true })
    image?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ type: "varchar", default: null })
    mobileNumber?: string;

    @Column()
    associated_internal_company_id: number;

    @ManyToOne(() => InternalCompany, { eager: false })
    @JoinColumn({ name: "associated_internal_company_id" })
    role: InternalCompany;

    // Relations
    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    @Column({ type: "boolean", default: false })
    isAccountByAdmin: boolean;
}

// ---------------------- SESSION ----------------------
@Entity("session")
@Unique(["token"])
export class Session {
    @PrimaryColumn("text")
    id: string;

    @Column({ name: "expires_at", type: "timestamp" })
    expiresAt: Date;

    @Column("text")
    token: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "ip_address", type: "text", nullable: true })
    ipAddress?: string;

    @Column({ name: "user_agent", type: "text", nullable: true })
    userAgent?: string;

    @Column({ name: "user_id", type: "text" })
    userId: string;

    @ManyToOne(() => Customer, (user) => user.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: Customer;
}

// ---------------------- ACCOUNT ----------------------
@Entity("account")
export class Account {
    @PrimaryColumn("text")
    id: string;

    @Column({ name: "account_id", type: "text" })
    accountId: string;

    @Column({ name: "provider_id", type: "text" })
    providerId: string;

    @Column({ name: "user_id", type: "text" })
    userId: string;

    @ManyToOne(() => Customer, (user) => user.accounts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: Customer;

    @Column({ name: "access_token", type: "text", nullable: true })
    accessToken?: string;

    @Column({ name: "refresh_token", type: "text", nullable: true })
    refreshToken?: string;

    @Column({ name: "id_token", type: "text", nullable: true })
    idToken?: string;

    @Column({
        name: "access_token_expires_at",
        type: "timestamp",
        nullable: true,
    })
    accessTokenExpiresAt?: Date;

    @Column({
        name: "refresh_token_expires_at",
        type: "timestamp",
        nullable: true,
    })
    refreshTokenExpiresAt?: Date;

    @Column({ type: "text", nullable: true })
    scope?: string;

    @Column({ type: "text", nullable: true })
    password?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

// ---------------------- VERIFICATION ----------------------
@Entity("verification")
export class Verification {
    @PrimaryColumn("text")
    id: string;

    @Column("text")
    identifier: string;

    @Column("text")
    value: string;

    @Column({ name: "expires_at", type: "timestamp" })
    expiresAt: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
