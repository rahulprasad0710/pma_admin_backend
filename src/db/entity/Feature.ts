import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { InternalCompany } from "./InternalCompany";
import { Sprint } from "./sprint";
import { User } from "./User";

@Entity()
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    slug: string;

    @Column()
    active: boolean;

    @Column({ nullable: true, default: null })
    profilePicture: string;

    @ManyToOne(() => InternalCompany, (company) => company.id, {
        nullable: false,
    })
    internalCompany: InternalCompany;

    @ManyToOne(() => User, (user) => user.id)
    admin: User;

    @ManyToOne(() => Sprint, (sprint) => sprint.id)
    active_sprint: Sprint;

    @ManyToMany(() => User, (user) => user.id, {
        cascade: true,
        eager: false,
    })
    @JoinTable({
        name: "feature_team_member",
        joinColumn: {
            name: "feature_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    featureTeamMember: User[];
}
