import {
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";

import { AttributeValue } from "./AttributeValue";
import { ProductAttribute } from "./Attribute";
import { ProductVariant } from "./ProductVariants";

@Entity({ name: "ecommerce_variant_attributes" })
@Unique("uq_ecommerce_variant_attribute", ["product_variant", "attribute"])
@Index("idx_ecommerce_variant_attrs_variant", ["product_variant"])
@Index("idx_ecommerce_variant_attrs_value", ["attribute_value"])
export class VariantAttribute {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductVariant, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @ManyToOne(() => ProductAttribute, {
        nullable: false,
    })
    @JoinColumn({ name: "attribute_id" })
    attribute: ProductAttribute;

    @ManyToOne(() => AttributeValue, {
        nullable: false,
    })
    @JoinColumn({ name: "attribute_value_id" })
    attribute_value: AttributeValue;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
}
