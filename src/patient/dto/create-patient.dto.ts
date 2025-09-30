import { IsDateString } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreatePatientDto extends CreateUserDto {
   @IsDateString()
   dateOfBirth: string
}
