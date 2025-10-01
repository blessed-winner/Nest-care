import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.authService.signUp(dto.email,dto,Role.ADMIN);
  }
  @Post('doctor/register')
  async doctorSignUp(@Body() dto: CreateDoctorDto){
    return await this.authService.signUp(dto.email,dto,Role.DOCTOR)
  }
  @Post('patient/register')
  async patientSignUp(@Body() dto: CreatePatientDto){
    return await this.authService.signUp(dto.email,dto,Role.PATIENT)
  }

  @Post('login')
  async logIn(
    @Body('email') email:string,
    @Body('password') password:string,
  ){
    const result = await this.authService.signIn(email,password)
    return result;
  }
}
