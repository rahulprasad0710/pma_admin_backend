import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { ProductVariant } from "./ProductVariants";
import { UserCustomer } from "../users/UserCustomer";

export enum EventType {
    CART = "CART",
    WISHLIST = "WISHLIST",
    CLICK = "CLICK",
}

@Entity({ name: "user_events" })
@Index("idx_user_events_product_variant", ["product_variant"])
@Index("idx_user_events_created_at", ["created_at"])
@Index("idx_user_events_user", ["user"])
export class UserEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProductVariant, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_variant_id" })
    product_variant: ProductVariant;

    @ManyToOne(() => UserCustomer, {
        nullable: true,
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "user_id" })
    user?: UserCustomer;

    @Column({
        type: "enum",
        enum: EventType,
        default: EventType.CLICK,
    })
    event_type: EventType;

    @Column({ type: "int", default: 1 })
    quantity: number;

    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    created_at: Date;
}
