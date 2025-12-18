import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Categories } from "./Categories";
import { Product } from "./Product";
import { UploadFile } from "../uploads";

@Entity({
    name: "ecommerce_brands",
})
export class Brands {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_id: number;

    @ManyToOne(() => Categories, (category) => category.id)
    @JoinColumn({ name: "category_id" })
    category: Categories;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    slug: string;

    @Column({ type: "text" })
    description: string;

    @ManyToOne(() => UploadFile, { nullable: true })
    @JoinColumn({ name: "thumbnail_id" })
    thumbnail: UploadFile;

    @ManyToOne(() => UploadFile, { nullable: true })
    @JoinColumn({ name: "cover_pic_id" })
    cover_pic: UploadFile;

    @Column({ default: 0 })
    display_order: number;

    @Column({ default: 0 })
    is_featured: number;

    @Column({ default: 1 })
    is_active: number;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
}
