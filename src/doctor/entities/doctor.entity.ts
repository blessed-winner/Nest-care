import { Appointment } from "src/appointment/entities/appointment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable:true })
    specialization?:string

    @OneToOne(()=>User, user => user.doctor,{onDelete:'CASCADE'})
    @JoinColumn()
    user:User

    @OneToMany(()=>Appointment,appointment => appointment.doctor)
    appointments:Appointment[]
}
