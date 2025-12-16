import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Product } from "./Product";

@Entity({ name: "product_variants" })
@Index("idx_variants_product", ["product"])
@Index("idx_variants_active", ["is_active"])
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.variants, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ length: 100, unique: true })
    variant_sku: string; // TSHIRT-BLUE-M

    @Column({ default: false })
    is_default_variant: boolean;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
}
