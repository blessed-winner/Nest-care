import { IsDate, IsEnum, IsString } from "class-validator";
import { Type } from 'class-transformer'
import { AppStatus } from "../entities/appointment.entity";

export class CreateAppointmentDto {
    @IsString()
    doctor:string

    @IsString()
    patient:string

    @Type(()=>Date)
    @IsDate()
    appointmentDate:Date

    @IsEnum(AppStatus)
    status:AppStatus

    @IsString()
    reason:string
}
