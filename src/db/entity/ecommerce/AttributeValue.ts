import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";

import { ProductAttribute } from "./Attribute";
import { UploadFile } from "../uploads";

@Entity({ name: "attribute_values" })
@Unique("uq_attribute_value", ["attribute", "value"])
@Index("idx_attribute_values_attribute", ["attribute"])
export class AttributeValue {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_attribute_id" })
    attribute: ProductAttribute;

    @Column({ length: 255 })
    value: string; // M, L, Red, Blue

    @Column({ length: 255, nullable: true })
    display_value: string;

    @Column({ length: 7, nullable: true })
    color_hex: string; // #FF0000

    @Column({ length: 500, nullable: true })
    image_url: UploadFile;

    @Column({ default: 0 })
    display_order: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
}
