import { IsDate, IsInt, IsString } from "class-validator";


export class AppointmentResponseDto{
       @IsInt()
       doctorId:number

       @IsInt()
       patientId:number

       @IsDate()
       appointmentDate:Date

       @IsString()
       status:string

       @IsString()
       reason:string
}