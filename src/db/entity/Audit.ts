import { BeforeInsert, Column, ManyToOne } from "typeorm";

import { User } from "./User";

export abstract class BaseEntityWithAudit {
    @Column()
    addedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    addedBy: User;

    @Column({ nullable: true })
    updatedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    updatedBy: User;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    deletedBy: User;

    @BeforeInsert()
    setCreateDates() {
        this.addedAt = new Date();
    }
}
