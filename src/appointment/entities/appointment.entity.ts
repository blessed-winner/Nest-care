import { Doctor } from "src/doctor/entities/doctor.entity";
import { Patient } from "src/patient/entities/patient.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum AppStatus{
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Doctor,doctor => doctor.appointments)
    @JoinColumn()
    doctor:Doctor

    @ManyToOne(()=>Patient,patient => patient.appointments)
    @JoinColumn()
    patient:Patient

    @CreateDateColumn()
    appointmentDate:Date

    @Column({
        type:'enum',
        enum:AppStatus,
        default:AppStatus.PENDING
    })
    status:AppStatus
}
