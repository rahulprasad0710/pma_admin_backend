// entities/ProjectTaskStatus.ts

import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";
import { ProductVariant } from "./ProductVariants";
import { UploadFile } from "../uploads";

@Entity("ecommerce_product_uploads")
export class ProductUpload {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "main_product_id" })
    main_product: Product;

    @ManyToOne(() => ProductVariant, (product) => product.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @Column({ nullable: false, default: 0 })
    is_primary: number;

    @ManyToOne(() => UploadFile, (upload) => upload.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "upload_id" })
    upload: UploadFile;
}
