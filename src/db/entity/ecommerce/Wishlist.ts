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

import { Product } from "./Product";
import { ProductVariant } from "./ProductVariants";
import { UserCustomer } from "../users/UserCustomer";

@Entity({ name: "wishlist" })
@Unique("uq_wishlist_user_variant", ["user", "product_variant"])
@Index("idx_wishlist_user", ["user"])
@Index("idx_wishlist_product_variant", ["product_variant"])
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserCustomer, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: UserCustomer;

    @ManyToOne(() => Product, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(() => ProductVariant, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @CreateDateColumn({ type: "timestamp", name: "added_at" })
    added_at: Date;
}
