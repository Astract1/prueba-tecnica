import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


/**
 * Representa a cualquier usuario en el sistema
 * Tanto como el uuid, como el email y el password son únicos
 * y no pueden ser nulos. 
 */

@Entity("users")
export class UserTypeormEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({name:"first_name"})
    firstName: string;

    @Column({name:"last_name"})
    lastName: string;

    @Column({ name : "is_active", default: true })
    isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;    
}

