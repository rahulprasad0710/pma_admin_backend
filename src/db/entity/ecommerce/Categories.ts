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

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

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

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
