import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient {
   @PrimaryGeneratedColumn()
   id:number

   @Column()
   firstName:string

   @Column()
   lastName:string

   @CreateDateColumn()
   dateOfBirth: Date;

   @OneToOne(()=>User,user => user.patient)
   @JoinColumn()
   user:User
}
