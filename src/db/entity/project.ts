import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Priority, ProjectStatus } from "../../enums/Priority";

import { InternalCompany } from "./InternalCompany";
import { ProjectTaskStatus } from "./ProjectTaskStatus";
import { UploadFile } from "./uploads";
import { User } from "./User";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true, default: null })
    profilePicture: string;

    @Column({
        type: "enum",
        enum: ProjectStatus,
        default: ProjectStatus.STARTED,
    })
    status: string;

    @Column({
        type: "enum",
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority: Priority;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => InternalCompany, (company) => company.projects, {
        onDelete: "SET NULL",
        nullable: true,
    })
    internalCompany: InternalCompany;

    @ManyToOne(() => User, (user) => user.id)
    admin: User;

    @ManyToMany(() => User, (user) => user.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "team_member",
        joinColumn: {
            name: "projectId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id",
        },
    })
    teamMember: User[];

    @ManyToMany(() => UploadFile, (upload) => upload.id, {
        cascade: true,
        lazy: true,
    })
    @JoinTable({
        name: "project_uploads",
        joinColumn: {
            name: "projectId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "uploadId",
            referencedColumnName: "id",
        },
    })
    projectUploads: UploadFile[];

    @OneToMany(() => ProjectTaskStatus, (pts) => pts.project, {
        cascade: true,
        eager: true,
    })
    projectTaskStatus: ProjectTaskStatus[];
}
