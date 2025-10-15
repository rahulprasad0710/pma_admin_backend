import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { UPLOAD_TYPE } from "../../enums/aws.enum";
import { User } from "./User";

@Entity()
export class UploadFile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    filename: string;

    @Column()
    originalname: string;

    @Column("int")
    size: number;

    @Column()
    extension: string;

    @Column({ nullable: true })
    mimetype: string;

    @Column({ nullable: true })
    fileType: string;

    @Column({ nullable: true })
    cloudPath: string;

    @Column({ nullable: true })
    cloudId: string;

    @Column({ nullable: true })
    cloudUrl: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: "enum",
        enum: UPLOAD_TYPE,
        default: UPLOAD_TYPE.PRIVATE,
    })
    upload_type: string;
}
