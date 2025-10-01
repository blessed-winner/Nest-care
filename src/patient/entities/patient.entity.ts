import { Appointment } from "src/appointment/entities/appointment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient {
   @PrimaryGeneratedColumn()
   id:number

   @CreateDateColumn()
   dateOfBirth: Date;

   @OneToOne(()=>User,user => user.patient,{onDelete:'CASCADE'})
   @JoinColumn()
   user:User

   @OneToMany(()=>Appointment,appointment => appointment.patient)
   appointments:Appointment[]
}
