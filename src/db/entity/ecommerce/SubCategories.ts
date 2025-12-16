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
    name: "subcategories",
})
export class SubCategories {
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

    @Column({ nullable: true })
    thumbnail_url: UploadFile;

    @Column({ nullable: true })
    cover_pic_url: UploadFile;

    @Column({ default: 0 })
    display_order: number;

    @Column({ default: 1 })
    is_active: number;

    @Column({ type: "jsonb", default: "{}" })
    attributes: object;

    @OneToMany(() => Product, (product) => product.subcategory)
    products: Product[];
}
