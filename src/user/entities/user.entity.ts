import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column()
  email:string

  @Column()
  password:string

  @Column({
    type:'enum',
    enum:Role,
    default:Role.PATIENT
  })
  role:Role
}
