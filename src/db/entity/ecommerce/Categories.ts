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

import { Product } from "./Product";
import { UploadFile } from "../uploads";

@Entity({
    name: "ecommerce_categories",
})
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    slug: string;

    @Column({ nullable: true })
    url: string;

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

    @Column({ default: 1 })
    is_active: number;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
