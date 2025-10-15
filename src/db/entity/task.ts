import {
    Check,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Priority, TaskStatusEnum } from "../../enums/Priority";

import { Feature } from "./Feature";
import { Label } from "./taskLabel";
import { Project } from "./project";
import { Sprint } from "./sprint";
import { TaskStatus } from "./taskStatus";
import { UploadFile } from "./uploads";
import { User } from "./User";

@Entity()
@Check(`(
  ("projectId" IS NOT NULL AND "feature_id" IS NULL) OR
  ("projectId" IS NULL AND "feature_id" IS NOT NULL)
)`)
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // remove nullable for new DB.
    @Column({ nullable: true })
    taskNumber: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn()
    addedBy: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    assignedTo: User;

    @Column()
    description: string;

    @Column()
    addedDate: Date;

    @ManyToOne(() => User, (user) => user.id, {
        lazy: true,
        nullable: true,
        eager: false,
    })
    @JoinColumn()
    assignedBy: User;

    @ManyToOne(() => Label, (label) => label.id, { nullable: true })
    @JoinColumn()
    taskLabel: Label;

    @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: true })
    @JoinColumn()
    sprint: Sprint;

    @Column({
        type: "enum",
        enum: TaskStatusEnum,
        default: TaskStatusEnum.TODO,
    })
    status: TaskStatus;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, {
        nullable: true,
    })
    @JoinColumn()
    task_status: TaskStatus;

    @Column({
        type: "enum",
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority: Priority;

    @ManyToOne(() => Project, (project) => project.id, { nullable: true })
    @JoinColumn({
        name: "projectId",
    })
    project: Project;

    @ManyToOne(() => Feature, (feature) => feature.id, { nullable: true })
    @JoinColumn({
        name: "feature_id",
    })
    feature: Feature;

    @ManyToMany(() => UploadFile, (upload) => upload.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "task_uploads",
        joinColumn: {
            name: "taskId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "uploadId",
            referencedColumnName: "id",
        },
    })
    taskUploads: UploadFile[];
}
