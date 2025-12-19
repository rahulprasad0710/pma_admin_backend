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
import { ProductVariant } from "./ProductVariants";
import { UserCustomer } from "../users/UserCustomer";

@Entity({ name: "cart_items" })
@Index("idx_cart_items_user", ["user"])
@Index("idx_cart_items_product_variant", ["product_variant"])
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserCustomer, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "user_id" })
    user?: UserCustomer;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
        name: "session_id",
    })
    session_id?: string;

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

    @Column({ type: "int", default: 1 })
    quantity: number;

    @CreateDateColumn({ type: "timestamp", name: "added_at" })
    added_at: Date;

    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updated_at: Date;
}
