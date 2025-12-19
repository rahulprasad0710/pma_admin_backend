import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "verification" })
@Index("idx_verification_identifier", ["identifier"])
export class Verification {
    @PrimaryColumn({ type: "text" })
    id: string;

    @Column({ type: "text" })
    identifier: string;

    @Column({ type: "text" })
    value: string;

    @Column({ type: "timestamp", name: "expires_at" })
    expires_at: Date;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;
}
