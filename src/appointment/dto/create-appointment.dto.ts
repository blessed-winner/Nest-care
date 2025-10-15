import { IsDate, IsEnum, IsInt, IsString } from "class-validator";
import { Type } from 'class-transformer'
import { AppStatus } from "../entities/appointment.entity";

export class CreateAppointmentDto {
    @IsInt()
    doctorId?:number

    @IsInt()
    patientId?:number

    @Type(()=>Date)
    @IsDate()
    appointmentDate:Date

    @IsString()
    reason:string
}
