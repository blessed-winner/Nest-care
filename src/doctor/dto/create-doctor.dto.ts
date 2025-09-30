import { IsString } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateDoctorDto extends CreateUserDto {
    @IsString()
    specialization: string
}
