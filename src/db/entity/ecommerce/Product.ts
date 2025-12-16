import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Brands } from "./Brand";
import { Categories } from "./Categories";
import { ProductVariant } from "./ProductVariants";
import { SubCategories } from "./SubCategories";
import { UploadFile } from "../uploads";

@Entity({
    name: "products",
})
@Index("idx_products_category", ["category"])
@Index("idx_products_brand", ["brand"])
@Index("idx_products_active", ["is_active"])
@Index("idx_products_name", ["name"])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    sku: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    slug: string;

    @Column({ type: "text" })
    description: string;

    @ManyToOne(() => Categories, (category) => category.products, {
        nullable: false,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "category_id" })
    category: Categories;

    @ManyToOne(() => SubCategories, (subcategory) => subcategory.products, {
        nullable: false,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "sub_category_id" })
    subcategory: SubCategories;

    @ManyToOne(() => Brands, (brand) => brand.products, {
        nullable: false,
        onDelete: "RESTRICT",
    })
    @JoinColumn({ name: "brand_id" })
    brand: Brands;

    @Column({ nullable: true })
    thumbnail_url: UploadFile;

    @Column({ nullable: true })
    main_pic_url: UploadFile;

    @Column({ nullable: true })
    cover_pic_url: UploadFile;

    @Column({ default: 0 })
    is_featured: number;

    @Column({ default: 1 })
    is_active: number;

    @Column({ default: 0 })
    is_variant_product: number;

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];
}
