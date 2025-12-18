import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { AttributeValue } from "./AttributeValue";

enum AttributeType {
    TEXT,
    NUMBER,
    COLOR,
    IMAGE,
}

@Entity({ name: "ecommerce_product_attributes" })
export class ProductAttribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string; // Size, Color, Material

    @Column({ default: 0 })
    display_order: number;

    @Column({ default: true })
    is_filterable: boolean;

    @Column({ default: true })
    is_variant_attribute: boolean;

    @Column({
        enum: AttributeType,
        type: "enum",
        default: AttributeType.TEXT,
    })
    attribute_type: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @OneToMany(() => AttributeValue, (value) => value.attribute)
    values: AttributeValue[];
}
