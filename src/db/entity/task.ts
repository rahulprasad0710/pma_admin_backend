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

import { Feature } from "./Feature";
import { Label } from "./taskLabel";
import { Priority } from "../../enums/Priority";
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

    @Column()
    added_by_id: number;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: "added_by_id" })
    addedBy: User;

    @Column()
    assigned_to_id: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "assigned_to_id" })
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

    @Column()
    task_label: number;

    @ManyToOne(() => Label, (label) => label.id, { nullable: true })
    @JoinColumn({ name: "task_label" })
    taskLabel: Label;

    @Column()
    sprint_id: number;

    @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: true })
    @JoinColumn({ name: "sprint_id" })
    sprint: Sprint;

    @Column()
    task_status_id: number;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, {
        nullable: true,
    })
    @JoinColumn({ name: "task_status_id" })
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

    @Column()
    feature_id: number;
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
