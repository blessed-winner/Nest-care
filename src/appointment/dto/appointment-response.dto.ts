import { IsDate, IsInt, IsString } from "class-validator";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Patient } from "src/patient/entities/patient.entity";


export class AppointmentResponseDto{
       
       doctor:Doctor

       patient:Patient

       @IsDate()
       appointmentDate:Date

       @IsString()
       status:string

       @IsString()
       reason:string
}