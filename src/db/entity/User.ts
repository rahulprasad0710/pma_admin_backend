import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Role } from "./role";

@Entity()
export class User {
    constructor() {
        this.createdAt = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: "varchar", default: "PMA-0001" })
    employeeId: string;

    @Column()
    roleId: number;

    @ManyToOne(() => Role, { eager: false })
    @JoinColumn({ name: "roleId" })
    role: Role;

    @Column({ nullable: true })
    department: string;

    @Column({ type: "varchar", default: "0000-00-00" })
    mobileNumber: string;

    @Column({ default: false })
    emailVerified: boolean;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: false })
    is_remember_me: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    profilePictureUrl: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    verifyEmailToken: string;
}
