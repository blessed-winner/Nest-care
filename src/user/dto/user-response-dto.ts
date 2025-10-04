import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../entities/user.entity";

export class UserResponseDto{
    @ApiProperty()
    id:number

    @ApiProperty()
    firstName:string

    @ApiProperty()
    lastName:string

    @ApiProperty()
    email:string

    @ApiProperty()
    role:Role
}