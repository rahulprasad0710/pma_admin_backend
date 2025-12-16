import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";

import { Product } from "./Product";
import { ProductVariant } from "./ProductVariants";

export enum InventoryStatus {
    AVAILABLE = "available",
    PROCESSING = "processing",
    RESERVED = "reserved",
}

@Entity({ name: "product_variant_inventory" })
export class ProductVariantInventory {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ProductVariant, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "variant_id" })
    variant: ProductVariant;

    @OneToOne(() => Product, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "main_product_id" })
    product: Product;

    @Column({ type: "int", default: 0 })
    variant_quantity: number;

    @Column({ type: "int", default: 1 })
    low_stock_threshold: number;

    @Column({ type: "boolean", default: true })
    is_in_stock: boolean;
}

@Entity({ name: "inventory_locations" })
export class InventoryLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    code: string; // STORE, WAREHOUSE, FACTORY

    @Column({ length: 100 })
    name: string;
}

@Entity({ name: "product_variant_inventory_details" })
@Unique(["variant", "location", "status"])
export class ProductVariantInventoryDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductVariant, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @ManyToOne(() => Product, { onDelete: "CASCADE" })
    @JoinColumn({ name: "main_product_id" })
    product: Product;

    @ManyToOne(() => InventoryLocation)
    @JoinColumn({ name: "location_id" })
    location: InventoryLocation;

    @Column({
        type: "enum",
        enum: InventoryStatus,
        default: InventoryStatus.AVAILABLE,
    })
    status: InventoryStatus;

    @Column({ type: "int", default: 0 })
    quantity: number;
}

@Entity({ name: "inventory_movements" })
export class InventoryMovement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductVariant, { onDelete: "CASCADE" })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @ManyToOne(() => Product, { onDelete: "CASCADE" })
    @JoinColumn({ name: "main_product_id" })
    product: Product;

    @ManyToOne(() => InventoryLocation)
    @JoinColumn({ name: "from_location_id" })
    from_location: InventoryLocation;

    @ManyToOne(() => InventoryLocation, {
        nullable: true,
    })
    @JoinColumn({ name: "to_location_id" })
    to_location: InventoryLocation;

    @Column({ type: "boolean", default: false })
    for_delivery: boolean;

    @Column({ type: "int", default: 0 })
    quantity_transferred: number;

    @Column({ length: 50 })
    reason: string; // sale, restock, transfer, manufacture

    @CreateDateColumn()
    created_at: Date;
}
