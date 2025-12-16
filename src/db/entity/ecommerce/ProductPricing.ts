import {
    Check,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { ProductVariant } from "./ProductVariants";

enum PriceType {
    REGULAR = "Normal",
    SALE = "sale",
    WHOLESALE = "wholesale",
    MEMBER = "member",
}

@Entity({ name: "variant_prices" })
@Check(`"price" >= 0`)
@Check(`"mrp_price" IS NULL OR "mrp_price" >= 0`)
@Check(`"cost_price" IS NULL OR "cost_price" >= 0`)
// Performance indexes
@Index("idx_prices_variant", ["variant"])
@Index("idx_prices_active", ["is_active"])
// Partial unique index (PostgreSQL only)
@Index("uq_active_price_per_type", ["variant", "price_type"], {
    unique: true,
    where: `"is_active" = true`,
})
export class VariantPrice {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductVariant, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "variant_id" })
    variant: ProductVariant;

    @Column({
        length: 50,
        enum: PriceType,
        type: "enum",
        default: PriceType.REGULAR,
    })
    price_type: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: false })
    price: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: false })
    mrp_price: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    cost_price: number;

    @Column({ length: 3, default: "NPR" })
    currency: string;

    @Column({ default: true })
    is_active: boolean;
}
