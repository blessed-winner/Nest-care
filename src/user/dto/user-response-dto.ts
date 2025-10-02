import { ApiProperty } from "@nestjs/swagger";

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
    role:string

    @ApiProperty()
    createdAt:Date
}