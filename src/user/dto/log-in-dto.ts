import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginDto{
   @ApiProperty({ example:"user@company.com", description:"User email" })
   @IsString()
   email:string
   
   @ApiProperty({ example:"strongpassword123", description:"User password" })
   @IsString()
   password:string
}