import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Permission } from "./Permission";
import { User } from "./User";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    name: string;

    @Column({ default: true })
    role_type: string;

    @Column({ default: null })
    description: string;

    @OneToMany(() => User, (user) => user.role, {
        eager: false,
    })
    users: User[];

    @ManyToMany(() => Permission, { cascade: true })
    @JoinTable()
    permissions: Permission[];
}
