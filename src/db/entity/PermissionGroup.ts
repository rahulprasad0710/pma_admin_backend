import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PERMISSION_TYPE } from "../../enums/Permission";
import { Permission } from "./Permission";

@Entity()
export class PermissionGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({
        type: "enum",
        enum: PERMISSION_TYPE,
        default: PERMISSION_TYPE.NORMAL,
    })
    permission_type: string;

    @Column({ type: "text", nullable: true, default: null })
    description: string;

    @OneToMany(() => Permission, (permission) => permission.permissionGroup)
    permissions: Permission[];
}
