import { Doctor } from "src/doctor/entities/doctor.entity";
import { Patient } from "src/patient/entities/patient.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Role{
   ADMIN = 'admin',
   DOCTOR = 'doctor',
   PATIENT = 'patient'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  firstName:string

  @Column()
  lastName:string

  @Column({nullable:true})
  profilePicture?:string

  @Column({unique:true})
  email:string

  @Column()
  password:string

  @Column({default:false})
  isVerified:boolean

  @Column({
    type:'enum',
    enum:Role,
    default:Role.PATIENT
  })
  role:Role

  @OneToOne(()=>Doctor, doctor => doctor.user)
  doctor?: Doctor

  @OneToOne(()=>Patient, patient => patient.user)
  patient?: Patient
}
