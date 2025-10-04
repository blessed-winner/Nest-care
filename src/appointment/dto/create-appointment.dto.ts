import { IsDate, IsEnum, IsString } from "class-validator";
import { Type } from 'class-transformer'
import { AppStatus } from "../entities/appointment.entity";

export class CreateAppointmentDto {
    @IsString()
    doctorId:number

    @IsString()
    patientId:number

    @Type(()=>Date)
    @IsDate()
    appointmentDate:Date

    @IsEnum(AppStatus)
    status:AppStatus

    @IsString()
    reason:string
}
