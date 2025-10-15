import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { PermissionGroup } from "./PermissionGroup";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayName: string;

    @Column()
    enumName: string;

    @Column()
    permissionGroupId: number;

    @ManyToOne(() => PermissionGroup, (permission) => permission.id)
    @JoinColumn({ name: "permissionGroupId" })
    permissionGroup: PermissionGroup;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    description: string;
}
