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
    name: "ecommerce_products",
})
@Index("idx_ecommerce_products_category", ["category"])
@Index("idx_ecommerce_products_brand", ["brand"])
@Index("idx_ecommerce_products_active", ["is_active"])
@Index("idx_ecommerce_products_title", ["title"])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    sku: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    short_description: string;

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

    @ManyToOne(() => UploadFile, { nullable: true })
    @JoinColumn({ name: "thumbnail_id" })
    thumbnail: UploadFile;

    @ManyToOne(() => UploadFile, { nullable: true })
    @JoinColumn({ name: "cover_pic_id" })
    cover_pic: UploadFile;

    @ManyToOne(() => UploadFile, { nullable: true })
    @JoinColumn({ name: "main_pic" })
    main_pic: UploadFile;

    @Column({ default: 0 })
    is_featured: number;

    @Column({ default: 1 })
    is_active: number;

    @Column({ default: 0 })
    is_variant_product: number;

    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

    @Column({
        type: "text",
        array: true,
        default: () => "'{}'",
    })
    search_keywords: string[];
}
