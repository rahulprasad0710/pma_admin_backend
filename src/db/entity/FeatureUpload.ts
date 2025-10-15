// entities/ProjectTaskStatus.ts

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Feature } from "./Feature";
import { UploadFile } from "./uploads";

@Entity("feature_upload")
export class FeatureUpload {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Feature, (feature) => feature.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "feature_id" })
    feature: Feature;

    @ManyToOne(() => UploadFile, (upload) => upload.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "upload_id" })
    upload: UploadFile;
}
