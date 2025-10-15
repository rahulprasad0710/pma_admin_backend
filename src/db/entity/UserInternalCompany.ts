// entities/ProjectTaskStatus.ts

import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { InternalCompany } from "./InternalCompany";
import { User } from "./User";

@Entity("internal_company_member")
export class UserInternalCompany {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    internal_company_id: number;

    @ManyToOne(() => InternalCompany, (internalCompany) => internalCompany.id, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({ name: "internal_company_id" })
    internal_company: InternalCompany;
}
